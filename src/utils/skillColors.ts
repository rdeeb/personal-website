export const getSkillColor = (skill: string): string => {
  const colors = [
    'var(--azure-150)',
    'var(--purple-100)',
    'var(--rose-150)',
    'var(--teal-100)',
    'var(--green-150)',
    'var(--orange-150)',
    'var(--red-150)',
    'var(--blue-80)',
    'var(--azure-125)',
    'var(--purple-75)',
  ];

  // Simple hash function to get a consistent index for a string
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = skill.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
