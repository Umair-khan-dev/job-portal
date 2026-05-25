import Job from "../models/Job.js";

const buildJobFilter = (query) => {
  const {
    keyword,
    location,
    employmentType,
    experienceLevel,
    minSalary,
    maxSalary,
    skills,
  } = query;

  const filter = { isPublished: true };
  const and = [];

  const textOr = [];

  if (keyword) {
    const kw = keyword.trim();
    textOr.push(
      { title: { $regex: kw, $options: "i" } },
      { description: { $regex: kw, $options: "i" } },
      { location: { $regex: kw, $options: "i" } },
      { requiredSkills: { $elemMatch: { $regex: kw, $options: "i" } } }
    );
  }

  if (skills) {
    const skillList = String(skills)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    skillList.forEach((skill) => {
      textOr.push(
        { requiredSkills: { $elemMatch: { $regex: skill, $options: "i" } } },
        { title: { $regex: skill, $options: "i" } },
        { description: { $regex: skill, $options: "i" } }
      );
    });
  }

  if (textOr.length) {
    and.push({ $or: textOr });
  }

  if (location) {
    and.push({ location: { $regex: location.trim(), $options: "i" } });
  }

  if (employmentType) {
    and.push({ employmentType });
  }

  if (experienceLevel) {
    and.push({
      experienceLevel: {
        $regex: `^${experienceLevel.trim()}$`,
        $options: "i",
      },
    });
  }

  if (minSalary || maxSalary) {
    const min = Number(minSalary) || 0;
    const max = Number(maxSalary) || Number.MAX_SAFE_INTEGER;
    and.push({
      $or: [
        { salaryMin: 0, salaryMax: 0 },
        {
          $and: [
            { salaryMax: { $gte: min } },
            { salaryMin: { $lte: max } },
          ],
        },
      ],
    });
  }

  if (and.length) filter.$and = and;
  return filter;
};

export const getJobs = async (req, res) => {
  try {
    const filter = buildJobFilter(req.query);
    const hasFilters = Object.keys(req.query).some(
      (k) => req.query[k] !== undefined && String(req.query[k]).trim() !== ""
    );

    let jobs = await Job.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    let suggestions = [];

    if (jobs.length === 0 && hasFilters) {
      const { keyword, location, skills } = req.query;
      const relaxedAnd = [];

      if (keyword?.trim()) {
        const kw = keyword.trim();
        relaxedAnd.push({
          $or: [
            { title: { $regex: kw, $options: "i" } },
            { description: { $regex: kw, $options: "i" } },
            { requiredSkills: { $elemMatch: { $regex: kw, $options: "i" } } },
          ],
        });
      } else if (skills?.trim()) {
        const skill = String(skills).split(",")[0].trim();
        relaxedAnd.push({
          $or: [
            { title: { $regex: skill, $options: "i" } },
            { description: { $regex: skill, $options: "i" } },
            { requiredSkills: { $elemMatch: { $regex: skill, $options: "i" } } },
          ],
        });
      } else if (location?.trim()) {
        relaxedAnd.push({
          location: { $regex: location.trim(), $options: "i" },
        });
      }

      const relaxedFilter = { isPublished: true };
      if (relaxedAnd.length) relaxedFilter.$and = relaxedAnd;

      suggestions = await Job.find(relaxedFilter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .limit(6);

      if (suggestions.length === 0) {
        suggestions = await Job.find({ isPublished: true })
          .populate("createdBy", "name email")
          .sort({ createdAt: -1 })
          .limit(6);
      }
    }

    res.json({ jobs, suggestions, exactMatch: jobs.length > 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      experienceLevel,
      salaryMin,
      salaryMax,
      location,
      employmentType,
      isPublished,
    } = req.body;

    const skills = Array.isArray(requiredSkills)
      ? requiredSkills
      : String(requiredSkills || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    const job = await Job.create({
      title,
      description,
      requiredSkills: skills,
      experienceLevel,
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      location,
      employmentType,
      isPublished: isPublished !== false,
      createdBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const fields = [
      "title",
      "description",
      "experienceLevel",
      "salaryMin",
      "salaryMax",
      "location",
      "employmentType",
      "isPublished",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) job[f] = req.body[f];
    });

    if (req.body.requiredSkills !== undefined) {
      job.requiredSkills = Array.isArray(req.body.requiredSkills)
        ? req.body.requiredSkills
        : String(req.body.requiredSkills)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
