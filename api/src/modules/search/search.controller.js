import serviceProviderModel from '../services/serviceProvider.model.js';
import mongoose from "mongoose";

export const searchProviders = async (req, res) => {
  try {
    const {
      lat,
      lng,
      radius = 10,
      categoryId,
      subCategorySlug,
      sort = "distance",
      page = 1,
      limit = 9,
    } = req.query;

    const filters = {
      isActive: true,
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

    if (lat && lng) {
      const geoQuery = {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: Number(radius) * 1000,
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
