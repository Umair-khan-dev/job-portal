export const uploadResumeFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const url = `/uploads/resumes/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
};

export const uploadProfileImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const url = `/uploads/images/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
};
