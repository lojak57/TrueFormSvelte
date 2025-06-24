import { apiLogger } from "$lib/utils/logger";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const logger = apiLogger.child({ endpoint: "verticals" });

export const GET: RequestHandler = async () => {
  try {
    logger.debug("Fetching verticals list");
    // Return the list of available verticals/industries
    const verticals = [
      {
        id: "golf_recreation",
        name: "Golf & Recreation",
        description: "Golf courses, country clubs, and recreational facilities",
        icon: "⛳",
        color: "#22c55e",
      },
      {
        id: "oil_gas",
        name: "Oil & Gas",
        description: "Energy sector companies and oilfield services",
        icon: "🛢️",
        color: "#f59e0b",
      },
      {
        id: "healthcare",
        name: "Healthcare",
        description: "Medical practices, hospitals, and healthcare services",
        icon: "🏥",
        color: "#ef4444",
      },
      {
        id: "technology",
        name: "Technology",
        description: "Software companies, IT services, and tech startups",
        icon: "💻",
        color: "#3b82f6",
      },
      {
        id: "manufacturing",
        name: "Manufacturing",
        description: "Industrial manufacturing and production companies",
        icon: "🏭",
        color: "#6b7280",
      },
      {
        id: "professional_services",
        name: "Professional Services",
        description: "Consulting, legal, accounting, and business services",
        icon: "💼",
        color: "#8b5cf6",
      },
      {
        id: "retail",
        name: "Retail",
        description: "Retail stores, e-commerce, and consumer goods",
        icon: "🛍️",
        color: "#ec4899",
      },
      {
        id: "real_estate",
        name: "Real Estate",
        description:
          "Property management, real estate agencies, and development",
        icon: "🏠",
        color: "#10b981",
      },
    ];

    logger.info({ count: verticals.length }, "Returning verticals");
    return json(verticals);
  } catch (error) {
    logger.error({ error }, "Error fetching verticals");
    return json({ error: "Failed to fetch verticals" }, { status: 500 });
  }
};
