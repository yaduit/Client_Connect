import serviceProviderModel from '../services/serviceProvider.model.js';
import mongoose from "mongoose";

export const searchProviders = async (req, res) => {
  try {
    let {
      lat,
      lng,
      radius = 10,
      categoryId,
      subCategorySlug,
      sort = "distance",
      page = 1,
      limit = 9,
    } = req.query;

    // convert string query params to numbers where appropriate
    const latNum = lat !== undefined ? Number(lat) : null;
    const lngNum = lng !== undefined ? Number(lng) : null;
    const radNum = Number(radius);

    if ((lat !== undefined && isNaN(latNum)) || (lng !== undefined && isNaN(lngNum))) {
      return res.status(400).json({ message: "Invalid latitude or longitude" });
    }

    if (isNaN(radNum) || radNum < 0) {
      return res.status(400).json({ message: "Invalid radius" });
    }

    const filters = {
      isActive: true,
      // always ignore providers without coordinates or with default [0,0]
      'location.geo.coordinates': { $ne: [0, 0] }
    };

    /* ---------------- CATEGORY FILTER ---------------- */
    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid categoryId" });
      }
      filters.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    if (subCategorySlug) {
      filters.subCategorySlug = subCategorySlug.toLowerCase();
    }

    const skip = (page - 1) * limit;

    /* ---------------- LOCATION FILTER (OPTIONAL) ---------------- */
    let providers;

    if (latNum !== null && lngNum !== null) {
      const geoQuery = {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lngNum, latNum],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: radNum * 1000, // meters
          query: filters,
        },
      };

      const pipeline = [
        geoQuery,
        { $sort: sort === "rating" ? { ratingAverage: -1 } : { distance: 1 } },
        { $skip: skip },
        { $limit: Number(limit) },
        {
          $project: {
            businessName: 1,
            description: 1,
            location: { city: 1, state: 1 },
            ratingAverage: 1,
            totalReviews: 1,
            categoryId: 1,
            subCategorySlug: 1,
            distance: { $round: [{ $divide: ["$distance", 1000] }, 2] },
          },
        },
      ];

      providers = await serviceProviderModel.aggregate(pipeline);
    } else {
      /* -------- NO LOCATION: NORMAL QUERY -------- */
      providers = await serviceProviderModel
        .find(filters)
        .sort(sort === "rating" ? { ratingAverage: -1 } : { createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
    }

    return res.status(200).json({
      providers,
      page: Number(page),
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
