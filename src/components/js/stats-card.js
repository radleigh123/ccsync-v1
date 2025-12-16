export async function renderStatsCard(icon, color, title, value, description, id) {
  try {
    // Build the template directly instead of fetching
    const template = `
<div class="col-12 col-md-6 col-xl-4">
  <div class="glassmorphic-card h-100">
    <div class="card-body p-4">
      <div class="d-flex align-items-center mb-3">
        <div class="icon-box bg-${color} bg-opacity-10 rounded-3 p-3 me-3">
          <i class="bi-${icon} text-${color} fs-4"></i>
        </div>
        <div>
          <h6 class="text-uppercase text-muted mb-1 fw-bold" style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);">
            ${title}
          </h6>
          <h3 id="${id}" class="fw-bold mb-0 text-${color}">
            ${value}
          </h3>
        </div>
      </div>
      <p class="text-muted small mb-0">
        ${description}
      </p>
    </div>
  </div>
</div>`;

    return template;
  } catch (error) {
    console.error('Error creating stats card:', error);
    return '';
  }
}
