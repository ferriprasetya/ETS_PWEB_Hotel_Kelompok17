/**
 * script.js - Main logic for Home Page
 * Strictly Vanilla JS (ES6+)
 */

async function fetchHotels() {
  try {
    const response = await fetch('data/data.json')
    if (!response.ok) throw new Error('Failed to load data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID').format(number)
}

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize datepickers
  if (typeof flatpickr !== 'undefined') {
    flatpickr('.datepicker', {
      minDate: 'today',
      dateFormat: 'M j, Y',
    })
  }

  const featuredContainer = document.getElementById('featuredHotelsContainer')
  const loadingEl = document.getElementById('featuredLoading')
  if (!featuredContainer) return

  const hotels = await fetchHotels()

  // Hide loading
  if (loadingEl) loadingEl.style.display = 'none'

  // Get top 4 hotels for featured section
  const featuredHotels = hotels.slice(0, 4)

  let htmlMarkup = ''
  featuredHotels.forEach((hotel) => {
    const minPrice = Math.min(...hotel.rooms.map((r) => r.price))
    let priceStr = formatRupiah(minPrice)

    htmlMarkup += `
            <div class="col-md-6 col-lg-3">
                <a href="detail/index.html?id=${hotel.id}" class="destination-card">
                    <img src="${hotel.image}" alt="${hotel.name}">
                    <div class="destination-overlay">
                        <h4 class="fw-bold mb-1 fs-5">${hotel.name}</h4>
                        <div class="mb-1" style="font-size: 0.8rem;">
                            <span class="text-white-50">From </span>
                            <span class="text-warning fw-bold">Rp ${priceStr}/night</span>
                        </div>
                        <p class="mb-0 text-white-50 text-truncate" style="font-size: 0.75rem;">${hotel.description}</p>
                    </div>
                </a>
            </div>
        `
  })

  featuredContainer.innerHTML = htmlMarkup
})
