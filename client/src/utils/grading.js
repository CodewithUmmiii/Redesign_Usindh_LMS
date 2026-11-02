import { GRADE_SCALE } from '../data/mock';

export const totalFor = (row = {}, distribution = []) =>
  Math.round(distribution.reduce((sum, d) => sum + (Number(row[d.key]) || 0), 0) * 10) / 10;

export const gradeFor = (total) => GRADE_SCALE.find((g) => total >= g.min) || GRADE_SCALE[GRADE_SCALE.length - 1];

export const gpa = (results) => {
  const credits = results.reduce((s, r) => s + r.credits, 0);
  return credits ? results.reduce((s, r) => s + r.gp * r.credits, 0) / credits : 0;
};
