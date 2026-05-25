const EXP_LEVELS = ["entry", "junior", "mid", "senior", "lead"];

function normalizeSkill(skill) {
  return String(skill).trim().toLowerCase();
}

function skillMatches(candidateSkill, requiredSkill) {
  const c = normalizeSkill(candidateSkill);
  const r = normalizeSkill(requiredSkill);
  return c === r || c.includes(r) || r.includes(c);
}

export function calculateATSScore(candidate, job) {
  const candidateSkills = (candidate.skills || []).map(normalizeSkill);
  const requiredSkills = (job.requiredSkills || []).map(normalizeSkill);

  let skillsMatch = 0;
  if (requiredSkills.length > 0) {
    const matched = requiredSkills.filter((skill) =>
      candidateSkills.some((cs) => skillMatches(cs, skill))
    );
    skillsMatch = (matched.length / requiredSkills.length) * 100;
  } else {
    skillsMatch = 50;
  }

  const candidateExp = EXP_LEVELS.indexOf(
    (candidate.experienceLevel || "").toLowerCase()
  );
  const jobExp = EXP_LEVELS.indexOf(
    (job.experienceLevel || "").toLowerCase()
  );

  let experienceMatch = 50;
  if (jobExp >= 0 && candidateExp >= 0) {
    experienceMatch =
      candidateExp >= jobExp
        ? 100
        : Math.max(0, 100 - (jobExp - candidateExp) * 25);
  }

  const descWords = (job.description || "")
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3);
  const uniqueWords = [...new Set(descWords)].slice(0, 60);
  const candidateText = candidateSkills.join(" ");
  const keywordHits = uniqueWords.filter((w) =>
    candidateText.includes(w)
  ).length;
  const keywordRelevance =
    uniqueWords.length > 0
      ? (keywordHits / uniqueWords.length) * 100
      : 50;

  const atsScore = Math.round(
    skillsMatch * 0.5 + experienceMatch * 0.3 + keywordRelevance * 0.2
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !candidateSkills.some((cs) => skillMatches(cs, skill))
  );

  return {
    atsScore,
    skillsMatch: Math.round(skillsMatch),
    experienceMatch: Math.round(experienceMatch),
    keywordMatch: Math.round(keywordRelevance),
    missingSkills,
  };
}
