import PageView from "../models/pageViewModel.js";

export const logPageView = async (req, res) => {
  try {
    const { page, sessionId } = req.body;
    await PageView.create({
      page,
      sessionId,
      userAgent: req.headers["user-agent"] || "",
      referrer: req.headers["referer"] || "",
    });
    res.status(201).json({ msg: "ok" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getVisitorStats = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Today's stats
    const todayViews = await PageView.countDocuments({ createdAt: { $gte: todayStart } });
    const todaySessionsAgg = await PageView.aggregate([
      { $match: { createdAt: { $gte: todayStart } } },
      { $group: { _id: "$sessionId" } },
      { $count: "count" },
    ]);
    const todayVisitors = todaySessionsAgg[0]?.count || 0;

    // Top pages (last 30 days)
    const topPages = await PageView.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$page", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { page: "$_id", count: 1, _id: 0 } },
    ]);

    // Daily stats (last 30 days)
    const dailyStats = await PageView.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          pageViews: { $sum: 1 },
          visitors: { $addToSet: "$sessionId" },
        },
      },
      {
        $project: {
          date: "$_id",
          pageViews: 1,
          visitors: { $size: "$visitors" },
          _id: 0,
        },
      },
      { $sort: { date: -1 } },
    ]);

    // Total visitors (30 days)
    const totalSessionsAgg = await PageView.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$sessionId" } },
      { $count: "count" },
    ]);
    const totalVisitors = totalSessionsAgg[0]?.count || 0;

    res.status(200).json({
      todayVisitors,
      todayPageViews: todayViews,
      totalVisitors,
      topPages,
      dailyStats,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
