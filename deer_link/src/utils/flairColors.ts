// Flair Color Mapping - 标签颜色映射
export const getFlairColor = (flair: string): { bg: string; text: string } => {
  if (flair.startsWith('s') || flair.startsWith('S')) {
    return { bg: '#A855F7', text: '#FFFFFF' }; // Metro lines - purple
  } else if (flair.includes('轮渡')) {
    return { bg: '#06B6D4', text: '#FFFFFF' }; // Ferry lines - cyan
  } else if (flair.startsWith('y') || flair.startsWith('Y')) {
    return { bg: '#6366F1', text: '#FFFFFF' }; // Night bus - indigo
  } else if (flair === '攻略' || flair === '推荐') {
    return { bg: '#3B82F6', text: '#FFFFFF' }; // Blue
  } else if (flair === '求助') {
    return { bg: '#9CA3AF', text: '#FFFFFF' }; // Gray
  } else if (flair === '优惠') {
    return { bg: '#F97316', text: '#FFFFFF' }; // Orange
  } else if (flair === '暖心') {
    return { bg: '#10B981', text: '#FFFFFF' }; // Green
  } else if (flair === '吐槽') {
    return { bg: '#EF4444', text: '#FFFFFF' }; // Red
  } else if (flair === '有轨电车') {
    return { bg: '#14B8A6', text: '#FFFFFF' }; // Teal
  } else if (flair === '机场巴士') {
    return { bg: '#EC4899', text: '#FFFFFF' }; // Pink
  } else if (flair === '地铁') {
    return { bg: '#9333EA', text: '#FFFFFF' }; // Purple-600
  } else {
    // Regular bus lines - use hash for consistency
    const colors = [
      { bg: '#3B82F6', text: '#FFFFFF' }, // Blue
      { bg: '#10B981', text: '#FFFFFF' }, // Green
      { bg: '#F97316', text: '#FFFFFF' }, // Orange
      { bg: '#EF4444', text: '#FFFFFF' }, // Red
      { bg: '#EC4899', text: '#FFFFFF' }, // Pink
      { bg: '#14B8A6', text: '#FFFFFF' }, // Teal
    ];
    const hash = flair.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
};
