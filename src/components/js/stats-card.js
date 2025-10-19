export async function renderStatsCard(icon, color, title, value, description, id) {
  try {
    const response = await fetch('/components/html/stats-card.html');
    let template = await response.text();

    // Replace placeholders
    template = template
      .replace('{{icon}}', icon)
      .replace(/{{color}}/g, color)
      .replace('{{title}}', title)
      .replace('{{value}}', value)
      .replace('{{description}}', description)
      .replace('{{id}}', id);

    return template;
  } catch (error) {
    console.error('Error loading stats card template:', error);
    return '';
  }
}
