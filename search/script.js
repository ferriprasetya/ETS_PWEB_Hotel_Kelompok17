/**
 * search/script.js - Main logic for Search Page
 * Strictly Vanilla JS (ES6+)
 */

const getBookmarks = () => JSON.parse(localStorage.getItem('hotel_bookmarks') || '[]')
const toggleBookmark = (id) => {
  let b = getBookmarks()
  if (b.includes(id)) b = b.filter((i) => i !== id)
  else b.push(id)
  localStorage.setItem('hotel_bookmarks', JSON.stringify(b))
  return b
}

async function fetchHotels() {
  try {
    // Now fetching from ../data/data.json
    const response = await fetch('../data/data.json')
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
  const searchContainer = document.getElementById('searchResultsContainer')
  const loadingEl = document.getElementById('searchLoading')
  const resultsCountEl = document.getElementById('resultsCount')
  const sortDropdown = document.getElementById('filterSort')
  const btnListView = document.getElementById('btnListView')
  const btnGridView = document.getElementById('btnGridView')

  if (!searchContainer) return

  let allHotels = await fetchHotels()
  let currentMode = 'list' // can be 'list' or 'grid'
  let showBookmarksOnly = false

  if (loadingEl) loadingEl.style.display = 'none'

  // State functions
  const setMode = (mode) => {
    currentMode = mode
    if (mode === 'list') {
      btnListView.classList.add('active')
      btnGridView.classList.remove('active')
    } else {
      btnGridView.classList.add('active')
      btnListView.classList.remove('active')
    }
    renderHotels(allHotels)
  }

  const getBadgeClass = (badgeText) => {
    if (!badgeText) return ''
    const lower = badgeText.toLowerCase()
    if (lower.includes('deal')) return 'badge-green'
    if (lower.includes('location')) return 'badge-blue'
    return 'badge-purple' // for guest favourite, best value etc.
  }

  const generateStars = (rating) => {
    let stars = ''
    const full = Math.round(rating)
    for (let i = 0; i < full; i++) {
      stars += '<i class="bi bi-star-fill me-1"></i>'
    }
    return stars
  }

  const renderHotels = (hotelsList) => {
    resultsCountEl.textContent = hotelsList.length.toString()

    if (hotelsList.length === 0) {
      searchContainer.innerHTML = `<div class="col-12 py-5 text-center"><h3 class="text-muted">No hotels found.</h3></div>`
      return
    }

    // Apply Sort and Filter
    const sortVal = sortDropdown ? sortDropdown.value : 'rating'
    const bookmarkedIds = getBookmarks()

    let filteredHotels = [...hotelsList]
    if (showBookmarksOnly) {
      filteredHotels = filteredHotels.filter((h) => bookmarkedIds.includes(h.id))
    }

    const sortedHotels = filteredHotels.sort((a, b) => {
      if (sortVal === 'lowest_price') {
        const minA = Math.min(...a.rooms.map((r) => r.price))
        const minB = Math.min(...b.rooms.map((r) => r.price))
        return minA - minB
      }
      return b.rating - a.rating // Default to rating
    })

    resultsCountEl.textContent = sortedHotels.length.toString()

    if (sortedHotels.length === 0) {
      searchContainer.innerHTML = `<div class="col-12 py-5 text-center"><h3 class="text-muted">No hotels found.</h3></div>`
      return
    }

    let htmlMarkup = ''
    sortedHotels.forEach((hotel) => {
      const minPrice = Math.min(...hotel.rooms.map((r) => r.price))
      const oldPrice = formatRupiah(Math.round(minPrice * 1.15)) // Mock original price
      const badgeClass = getBadgeClass(hotel.badge)
      const badgeHtml = hotel.badge
        ? `<div class="result-card-badge ${badgeClass}">${hotel.badge}</div>`
        : ''

      const isBookmarked = bookmarkedIds.includes(hotel.id)
      const bookmarkIcon = isBookmarked ? 'bi-bookmark-fill text-primary' : 'bi-bookmark'

      // Format features
      const features = hotel.features || []
      let featuresHtml = ''
      features.forEach((f) => {
        const icon = f.toLowerCase().includes('cancellation')
          ? 'check2'
          : f.toLowerCase().includes('wifi')
            ? 'wifi'
            : 'check2-circle'
        featuresHtml += `<div class="feature-chip"><i class="bi bi-${icon} me-1 text-success font-weight-bold"></i> ${f}</div>`
      })

      if (currentMode === 'list') {
        htmlMarkup += `
                    <div class="col-12">
                        <div class="result-card d-flex flex-column flex-md-row">
                            <div class="result-card-img-wrapper result-card-img-wrapper__list" style="flex-shrink: 0;">
                                ${badgeHtml}
                                <div class="result-card-heart bookmark-btn" data-id="${hotel.id}"><i class="bi ${bookmarkIcon}"></i></div>
                                <img src="${hotel.image}" class="w-100 h-100" style="object-fit: cover; min-height: 200px;" alt="${hotel.name}">
                            </div>
                            <div class="p-3 w-100 d-flex flex-column justify-content-between">
                                <div class="d-flex justify-content-between">
                                    <div class="pe-3">
                                        <h5 class="fw-bold mb-1"><a href="../detail/index.html?id=${hotel.id}" class="text-dark text-decoration-none">${hotel.name}</a> <span class="text-warning small ms-1">${generateStars(hotel.rating)}</span></h5>
                                        <p class="text-primary small mb-1"><i class="bi bi-geo-alt"></i> ${hotel.location} <span class="text-muted ms-2 px-1">2.5 km from centre</span></p>
                                        <p class="text-muted small">Luxury Hotel • Sea View Room • King Bed</p>
                                    </div>
                                    <div class="text-end d-flex gap-2 align-items-start me-5">
                                        <div class="text-end d-none d-sm-block">
                                            <div class="text-primary fw-bold" style="font-size: 0.8rem;">Excellent</div>
                                            <div class="text-muted" style="font-size: 0.65rem;">1,200 reviews</div>
                                        </div>
                                        <div class="rating-box px-2 py-1">${hotel.rating.toFixed(1)}</div>
                                    </div>
                                </div>
                                
                                <div class="mt-2 d-flex flex-wrap gap-1">
                                    ${featuresHtml}
                                </div>
                                
                                <div class="d-flex justify-content-between align-items-end mt-3">
                                    <div>
                                       <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 mb-1">10% off</span>
                                    </div>
                                    <div class="text-end">
                                        <div class="text-muted small text-decoration-line-through">Rp${oldPrice}</div>
                                        <div class="fs-5 fw-bold mb-0">Rp${formatRupiah(minPrice)}</div>
                                        <div class="text-muted" style="font-size: 0.65rem;">5 nights, 2 adults</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
      } else {
        // Grid Mode
        htmlMarkup += `
                    <div class="col-sm-6 col-md-4 mb-2">
                        <div class="result-card h-100 d-flex flex-column">
                            <div class="result-card-img-wrapper" style="height: 200px;">
                                ${badgeHtml}
                                <div class="result-card-heart bookmark-btn" data-id="${hotel.id}"><i class="bi ${bookmarkIcon}"></i></div>
                                <img src="${hotel.image}" class="w-100 h-100" style="object-fit: cover;" alt="${hotel.name}">
                            </div>
                            <div class="p-3 d-flex flex-column flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start mb-1">
                                    <h6 class="fw-bold mb-0 text-truncate pe-2"><a href="../detail/index.html?id=${hotel.id}" class="text-dark text-decoration-none">${hotel.name}</a></h6>
                                    <span class="text-warning small text-nowrap">${generateStars(hotel.rating)}</span>
                                </div>
                                <p class="text-primary small mb-2 text-truncate"><i class="bi bi-geo-alt"></i> ${hotel.location}</p>
                                
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <div class="rating-box px-1 py-0" style="font-size: 0.75rem;">${hotel.rating.toFixed(1)}</div>
                                    <span class="text-primary fw-bold" style="font-size: 0.7rem;">Excellent</span>
                                    <span class="text-muted" style="font-size: 0.6rem;">1,200 reviews</span>
                                </div>
                                
                                <p class="text-muted mb-2 text-truncate" style="font-size: 0.75rem;">Luxury Hotel • Sea View Room</p>
                                
                                <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-end">
                                    <div>
                                        <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-1 py-1" style="font-size:0.6rem;">10% off</span>
                                    </div>
                                    <div class="text-end">
                                        <div class="text-muted text-decoration-line-through" style="font-size: 0.7rem;">Rp${oldPrice}</div>
                                        <div class="fs-6 fw-bold mb-0">Rp${formatRupiah(minPrice)}</div>
                                        <div class="text-muted" style="font-size: 0.6rem;">5 nights, 2 adults</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
      }
    })
    searchContainer.innerHTML = htmlMarkup
  }

  // Initial render
  renderHotels(allHotels)

  // Event Listeners
  if (btnListView) btnListView.addEventListener('click', () => setMode('list'))
  if (btnGridView) btnGridView.addEventListener('click', () => setMode('grid'))
  if (sortDropdown) sortDropdown.addEventListener('change', () => renderHotels(allHotels))

  // Toggle bookmarks filter
  const btnToggleBookmarks = document.getElementById('btnToggleBookmarks')
  if (btnToggleBookmarks) {
    btnToggleBookmarks.addEventListener('click', function () {
      showBookmarksOnly = !showBookmarksOnly
      if (showBookmarksOnly) {
        this.classList.remove('btn-outline-primary')
        this.classList.add('btn-primary')
      } else {
        this.classList.add('btn-outline-primary')
        this.classList.remove('btn-primary')
      }
      renderHotels(allHotels)
    })
  }

  // Bookmark buttons delegation
  searchContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.bookmark-btn')
    if (btn) {
      const id = parseInt(btn.getAttribute('data-id'))
      toggleBookmark(id)
      renderHotels(allHotels)
    }
  })
})
