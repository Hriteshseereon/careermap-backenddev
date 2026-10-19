import { AdminDashboardRepository }
from "./adminDashboard.repository.js";

const formatUserName = (user) => {
  const name = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || user?.username || user?.email || "Unknown";
};

export const getAllTransactions = async () => {
  const transactions =
    await AdminDashboardRepository.getAllTransactions();

  return {
    success: true,
    data: transactions.map((transaction) => ({
      id: transaction.id,
      userId: transaction.userId,
      userName: formatUserName(transaction.user),
      transactionId: transaction.stripeId || `PAY-${transaction.id}`,
      planId: transaction.planId,
      planName: transaction.plan?.name || null,
      amount: transaction.amount,
      paymentMethod: "Razorpay",
      status: transaction.status,
      date: transaction.createdAt,
    })),
  };
};

export const getAllMentorBookings = async () => {
  const bookings =
    await AdminDashboardRepository.getAllMentorBookings();

  return {
    success: true,
    data: bookings.map((booking) => ({
      id: booking.id,
      userId: booking.userId,
      userName: formatUserName(booking.user),
      mentorId: booking.mentorId,
      mentorName: booking.mentor?.name || null,
      date: booking.date,
      time: booking.timeSlot,
      receivedPayment:
        booking.payment?.amount ?? booking.amount ?? null,
      transactionId:
        booking.payment?.paymentId ||
        booking.payment?.orderId ||
        null,
      paymentStatus: booking.payment?.status || booking.paymentStatus,
      bookingStatus: booking.status,
      createdAt: booking.createdAt,
    })),
  };
};

export const getDashboardData = async () => {

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const [
    counts,
    subscriptions,
    loginHistory,
    plans,
  ] = await Promise.all([

    AdminDashboardRepository.getCounts(),

    AdminDashboardRepository.getLast30DaysSubscriptions(
      startDate
    ),

    AdminDashboardRepository.getLoginHistory(
      startDate
    ),

    AdminDashboardRepository.getPlanSubscriptions(),
  ]);

  const [
    totalUsers,
    totalMentors,
    totalPlans,
    totalInstitutions,
    totalQuizzes,
  ] = counts;

  // Subscription chart
  const subscriptionReport = {};

  subscriptions.forEach((sub) => {

    const date =
      sub.createdAt
        .toISOString()
        .split("T")[0];

    subscriptionReport[date] =
      (subscriptionReport[date] || 0) + 1;
  });

  // Login chart
  const loginChart = {};

  loginHistory.forEach((log) => {

    const date =
      log.loginAt
        .toISOString()
        .split("T")[0];

    loginChart[date] =
      (loginChart[date] || 0) + 1;
  });

  // Pie chart
  const totalSubscriptions =
    plans.reduce(
      (sum, p) =>
        sum + p.subscriptions.length,
      0
    );

  const planDistribution =
    plans.map((plan) => ({

      planId: plan.id,

      planName: plan.name,

      subscribers:
        plan.subscriptions.length,

      percentage:
        totalSubscriptions === 0
          ? 0
          : Number(
              (
                (plan.subscriptions.length /
                  totalSubscriptions) *
                100
              ).toFixed(2)
            ),
    }));

  return {
    success: true,

    data: {

      totalUsers,

      totalMentors,

      totalPlans,

      totalInstitutions,

      totalQuizzes,

      subscriptionReport,

      loginHistory: loginChart,

      planDistribution,
    },
  };
};