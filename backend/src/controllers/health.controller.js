import prisma from "../lib/prisma.js";

// Basic health check
export const getHealthStatus = async (req, res) => {
  try {
    const healthCheck = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      services: {},
    };

    try {
      await prisma.$queryRaw`SELECT 1`;
      healthCheck.services.database = {
        status: "healthy",
        timestamp: new Date().toISOString(),
      };
    } catch (dbError) {
      healthCheck.status = "degraded";
      healthCheck.services.database = {
        status: "unhealthy",
        error: dbError.message,
        timestamp: new Date().toISOString(),
      };
    }

    healthCheck.memory = {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(
        process.memoryUsage().heapTotal / 1024 / 1024
      )} MB`,
      heapUsed: `${Math.round(
        process.memoryUsage().heapUsed / 1024 / 1024
      )} MB`,
      external: `${Math.round(
        process.memoryUsage().external / 1024 / 1024
      )} MB`,
    };

    healthCheck.system = {
      platform: process.platform,
      architecture: process.arch,
      nodeVersion: process.version,
      cpuUsage: process.cpuUsage(),
    };

    res.json(healthCheck);
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
      details: error.message,
    });
  }
};

// Detailed system diagnostics
export const getSystemDiagnostics = async (req, res) => {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      database: {},
      application: {},
      statistics: {},
    };

    try {
      const [userCount, itemCount, requisitionCount, transactionCount] =
        await Promise.all([
          prisma.user.count(),
          prisma.item.count(),
          prisma.requisition.count(),
          prisma.transaction.count(),
        ]);

      diagnostics.database = {
        status: "connected",
        statistics: {
          users: userCount,
          items: itemCount,
          requisitions: requisitionCount,
          transactions: transactionCount,
        },
      };
    } catch (dbError) {
      diagnostics.database = {
        status: "disconnected",
        error: dbError.message,
      };
    }

    diagnostics.application = {
      uptime: process.uptime(),
      memory: {
        rss: process.memoryUsage().rss,
        heapTotal: process.memoryUsage().heapTotal,
        heapUsed: process.memoryUsage().heapUsed,
        external: process.memoryUsage().external,
      },
      cpu: process.cpuUsage(),
      environment: process.env.NODE_ENV || "development",
    };

    diagnostics.system = {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid,
    };

    res.json(diagnostics);
  } catch (error) {
    res.status(500).json({
      error: "Diagnostics failed",
      timestamp: new Date().toISOString(),
      details: error.message,
    });
  }
};

// Database connection test
export const testDatabaseConnection = async (req, res) => {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;

    res.json({
      status: "connected",
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      database: {
        provider: "PostgreSQL",
        connected: true,
        responseTime: responseTime,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "disconnected",
      timestamp: new Date().toISOString(),
      error: "Database connection failed",
      details: error.message,
    });
  }
};

// Service status overview
export const getServiceStatus = async (req, res) => {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      services: {
        database: "unknown",
        api: "healthy",
        authentication: "healthy",
        email: process.env.SMTP_USER ? "configured" : "not_configured",
      },
      metrics: {},
    };

    try {
      await prisma.$queryRaw`SELECT 1`;
      status.services.database = "healthy";

      const [activeUsers, recentTransactions] = await Promise.all([
        prisma.user.count({
          where: {
            lastLogin: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
        prisma.transaction.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        }),
      ]);

      status.metrics = {
        activeUsersLast7Days: activeUsers,
        transactionsLast24Hours: recentTransactions,
      };
    } catch (dbError) {
      status.services.database = "unhealthy";
    }

    res.json(status);
  } catch (error) {
    res.status(500).json({
      error: "Service status check failed",
      timestamp: new Date().toISOString(),
    });
  }
};
