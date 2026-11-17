"use strict";

window.createCircuitProgress = function (goalIds) {
  const valid = new Set(goalIds);
  const key = "credicorp-demo-v1";
  const interests = ["Sí", "Tal vez", "No por ahora"];
  const safeIds = (values) =>
    Array.isArray(values) ? values.filter((id) => valid.has(id)) : [];
  let stored = {};
  let storageAvailable = true;
  try {
    stored = JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch (error) {
    if (!(error instanceof SyntaxError)) storageAvailable = false;
  }
  const visited = new Set(safeIds(stored.visited));
  const checkedIn = new Set([...safeIds(stored.checkedIn), ...visited]);
  const surveys = {};
  for (const id of valid) {
    const answer = stored.surveys?.[id];
    if (
      answer &&
      Number.isInteger(answer.rating) &&
      answer.rating >= 1 &&
      answer.rating <= 5 &&
      interests.includes(answer.interest)
    )
      surveys[id] = answer;
  }

  function persist(name) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          name,
          visited: [...visited],
          checkedIn: [...checkedIn],
          surveys,
        }),
      );
    } catch {
      storageAvailable = false;
    }
    return storageAvailable;
  }

  return {
    mode: "demo",
    name: stored.name,
    get storageAvailable() {
      return storageAvailable;
    },
    visited,
    checkedIn,
    validateVisit(id, name) {
      if (!valid.has(id)) return false;
      checkedIn.add(id);
      persist(name);
      return true;
    },
    submitSurvey(id, answer, name) {
      if (
        !checkedIn.has(id) ||
        visited.has(id) ||
        !Number.isInteger(answer.rating) ||
        answer.rating < 1 ||
        answer.rating > 5 ||
        !interests.includes(answer.interest)
      )
        return false;
      surveys[id] = answer;
      visited.add(id);
      persist(name);
      return true;
    },
    persist,
    reset(name) {
      visited.clear();
      checkedIn.clear();
      for (const id of Object.keys(surveys)) delete surveys[id];
      persist(name);
    },
  };
};
