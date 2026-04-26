/**
 * detail/script.js - Main logic for Detail Page
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
  const detailContainer = document.getElementById('hotelDetailContainer')
  if (!detailContainer) return

  // Get ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const hotelId = parseInt(urlParams.get('id'))

  if (!hotelId) {
    detailContainer.innerHTML = `<div class="alert alert-danger">Invalid Hotel ID. <a href="../search/index.html" class="alert-link">Go back to search</a></div>`
    return
  }

  const hotels = await fetchHotels()
  const hotel = hotels.find((h) => h.id === hotelId)

  if (!hotel) {
    detailContainer.innerHTML = `<div class="alert alert-danger">Hotel not found. <a href="../search/index.html" class="alert-link">Go back to search</a></div>`
    return
  }

  // Init Datepickers for detail page forms if any
  setTimeout(() => {
    if (typeof flatpickr !== 'undefined') {
      flatpickr('.datepicker', { minDate: 'today', dateFormat: 'M j, Y' })
    }
  }, 100)

  // Helpers
  const generateSimpleStars = (rating) => {
    let stars = ''
    for (let i = 0; i < Math.round(rating); i++) {
      stars += '<i class="bi bi-star-fill text-warning me-1"></i>'
    }
    return stars
  }

  // Generate Room List HTML
  let roomsHtml = ''
  hotel.rooms.forEach((room, idx) => {
    const originalPrice = formatRupiah(Math.round(room.price * 1.15))
    const totalPrice = formatRupiah(room.price * 5) // Example calculation
    const roomImgUrl =
      room.image || `https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800`

    roomsHtml += `
            <div class="detail-room-card">
                <div class="row g-0">
                    <div class="col-md-4 position-relative">
                        <img src="${roomImgUrl}" class="detail-room-img" alt="${room.type}">
                        <button class="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2 shadow-sm" style="width:30px;height:30px;padding:0"><i class="bi bi-chevron-left" style="font-size:0.75rem;"></i></button>
                        <button class="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-2 shadow-sm" style="width:30px;height:30px;padding:0"><i class="bi bi-chevron-right" style="font-size:0.75rem;"></i></button>
                    </div>
                    <div class="col-md-5 p-4 d-flex flex-column justify-content-center">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5 class="fw-bold mb-0">${room.type}</h5>
                                <span class="text-danger small">1 rooms Left</span>
                            </div>
                            <div class="d-none d-lg-block text-end">
                                <div class="rating-box px-2 py-1 mb-1">${hotel.rating.toFixed(1)}</div>
                                <div class="text-muted" style="font-size: 0.6rem;">Excellent<br>1,260 reviews</div>
                            </div>
                        </div>
                        
                        <div class="d-flex gap-4 mb-4">
                            <div class="text-center">
                                <i class="bi bi-door-closed fs-5"></i>
                                <div class="small fw-semibold mt-1">1 King bed</div>
                            </div>
                            <div class="text-center">
                                <i class="bi bi-person fs-5"></i>
                                <div class="small fw-semibold mt-1">${room.capacity} Persons</div>
                            </div>
                        </div>
                        
                        <div class="small fw-bold text-muted mb-2">Details</div>
                        <div class="row g-3 small text-muted mb-3">
                            <div class="col-6"><i class="bi bi-cup-hot me-1"></i> Breakfast</div>
                            <div class="col-6"><i class="bi bi-wifi me-1"></i> Free Wifi</div>
                            <div class="col-6"><i class="bi bi-water me-1"></i> Sea View</div>
                            <div class="col-6"><i class="bi bi-arrows-angle-expand me-1"></i> 40 m²</div>
                            <div class="col-6"><i class="bi bi-slash-circle me-1"></i> No Smoking</div>
                            <div class="col-6"><i class="bi bi-snow me-1"></i> Air Conditioner</div>
                        </div>
                    </div>
                    <div class="col-md-3 border-start p-4 d-flex flex-column justify-content-center text-md-end text-center bg-light bg-opacity-50">
                        <div class="mb-4">
                            <span class="badge bg-success bg-opacity-10 text-success px-2 py-1 mb-2">10% off</span><br>
                            <span class="text-muted text-decoration-line-through small">Rp${originalPrice}</span>
                            <span class="fs-4 fw-bold text-dark ms-1">Rp${formatRupiah(room.price)}</span>
                            <div class="text-muted small mt-1">x 5 night<br>Total Price : Rp${totalPrice}</div>
                        </div>
                        <button class="btn btn-primary w-100 rounded-pill py-2 fw-bold open-booking-btn" 
                            data-bs-toggle="modal" 
                            data-bs-target="#bookingModal"
                            data-hotel-id="${hotel.id}"
                            data-hotel-name="${hotel.name}"
                            data-room-id="${room.id}"
                            data-room-type="${room.type}"
                            data-room-price="${room.price}">Reserve</button>
                    </div>
                </div>
            </div>
        `
  })

  const minPriceGlobal = Math.min(...hotel.rooms.map((r) => r.price))
  const maxPriceGlobal = Math.max(...hotel.rooms.map((r) => r.price))

  const isBookmarked = getBookmarks().includes(hotel.id)
  const detailBookmarkIcon = isBookmarked ? 'bi-bookmark-fill text-primary' : 'bi-bookmark'

  let carouselIndicators = ''
  let carouselItems = ''
  const hotelImages = hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.image]

  hotelImages.forEach((imgUrl, index) => {
    const activeClass = index === 0 ? 'active' : ''
    carouselIndicators += `<button type="button" data-bs-target="#hotelCarousel" data-bs-slide-to="${index}" class="${activeClass}" ${index === 0 ? 'aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>\n`

    let captionHtml = ''
    if (index === 0) {
      captionHtml = `
            <div class="carousel-caption d-none d-md-block text-start" style="bottom: 20px; left: 20px; right: auto;">
                <div class="glass-panel d-inline-flex align-items-center gap-2 p-2 rounded-pill px-3">
                    <img src="${hotel.image}" class="rounded-circle" style="width:40px;height:40px;object-fit:cover;" alt="...">
                    <div>
                        <div class="small text-dark fw-bold" style="font-size:0.6rem; text-transform:uppercase;">Hotel</div>
                        <div class="fw-bold fs-6 text-dark">${hotel.name}</div>
                    </div>
                </div>
            </div>`
    }

    carouselItems += `
        <div class="carousel-item ${activeClass}">
            <img src="${imgUrl}" class="d-block w-100" style="height: 500px; object-fit: cover;" alt="View ${index + 1}">
            ${captionHtml}
        </div>\n`
  })

  // Render Hotel Details layout
  const htmlMarkup = `
        <div class="row mb-5">
            <div class="col-12 mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="fw-bold mb-1">${hotel.name} <span class="ms-2" style="font-size:1rem;">${generateSimpleStars(hotel.rating)}</span></h2>
                    <p class="text-muted mb-0"><i class="bi bi-geo-alt"></i> ${hotel.location}, Indonesia</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center bookmark-btn" data-id="${hotel.id}" style="width:45px;height:45px;"><i class="bi ${detailBookmarkIcon} fs-5"></i></button>
                </div>
            </div>
            
            <div class="col-12 mb-4">
                <div id="hotelCarousel" class="carousel slide shadow-sm" data-bs-ride="carousel" style="border-radius: 1.5rem; overflow: hidden;">
                    <div class="carousel-indicators">
                        ${carouselIndicators}
                    </div>
                    <div class="carousel-inner">
                        ${carouselItems}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#hotelCarousel" data-bs-slide="prev">
                        <div class="glass-panel rounded-circle d-flex align-items-center justify-content-center text-dark" style="width: 40px; height: 40px;">
                            <span class="carousel-control-prev-icon" aria-hidden="true" style="filter: invert(1) grayscale(100); width: 1.5rem; height: 1.5rem;"></span>
                        </div>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#hotelCarousel" data-bs-slide="next">
                        <div class="glass-panel rounded-circle d-flex align-items-center justify-content-center text-dark" style="width: 40px; height: 40px;">
                            <span class="carousel-control-next-icon" aria-hidden="true" style="filter: invert(1) grayscale(100); width: 1.5rem; height: 1.5rem;"></span>
                        </div>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <div class="col-lg-12">
                <section class="mb-5">
                    <h4 class="fw-bold mb-3">Description</h4>
                    <p class="fw-semibold small mb-2">Hotel size 200 rooms, Arranged over 6 floors</p>
                    <p class="fw-bold mb-2">${hotel.location} elegance with 6-star service</p>
                    <p class="text-muted" style="line-height: 1.8;">
                        Simply elegant in all respects, this beautiful property offers a wonderful location that enhances your stay. Enjoy spacious rooms with great amenities and world-class service from a superb staff. ${hotel.description}
                    </p>
                </section>
                
                <hr class="my-5">
                
                <section class="mb-5">
                    <h4 class="fw-bold mb-4">Amenities</h4>
                    <div class="amenity-grid mb-4">
                        <div class="amenity-item"><i class="bi bi-cup-hot-fill fs-5"></i> Restaurant</div>
                        <div class="amenity-item"><i class="bi bi-umbrella-fill fs-5"></i> Bar</div>
                        <div class="amenity-item"><i class="bi bi-bicycle fs-5"></i> Gym</div>
                        <div class="amenity-item"><i class="bi bi-water fs-5"></i> Pool</div>
                        <div class="amenity-item"><i class="bi bi-signpost-2 fs-5"></i> Smoking Allowed</div>
                        <div class="amenity-item"><i class="bi bi-flower1 fs-5"></i> Spa</div>
                    </div>
                </section>

                <hr class="my-5">
                
                <section class="mb-5">
                    <h4 class="fw-bold mb-4">Rooms</h4>
                    <div class="d-flex gap-2 mb-4 overflow-auto pb-2">
                        <button class="filter-pill active bg-dark text-white border-dark">All Rooms</button>
                        <button class="filter-pill">1 Bed</button>
                        <button class="filter-pill">2 Beds</button>
                        <button class="filter-pill">3 Beds</button>
                    </div>
                    <div class="room-list pb-5">
                        ${roomsHtml}
                    </div>
                </section>
            </div>
        </div>
    `

  detailContainer.innerHTML = htmlMarkup

  // Delegate bookmark toggle event
  detailContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.bookmark-btn')
    if (btn) {
      const id = parseInt(btn.getAttribute('data-id'))
      const bookmarked = toggleBookmark(id)
      const icon = btn.querySelector('.bi')
      if (bookmarked.includes(id)) {
        icon.className = 'bi bi-bookmark-fill text-primary fs-5'
      } else {
        icon.className = 'bi bi-bookmark fs-5'
      }
    }
  })

  setupBookingModal()
})

function setupBookingModal() {
  const bookingModalEl = document.getElementById('bookingModal')
  if (!bookingModalEl) return

  // Listen to when modal is about to open to inject dynamic data
  bookingModalEl.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    const button = event.relatedTarget

    // Extract info from data-bs-* attributes
    const hotelName = button.getAttribute('data-hotel-name')
    const hotelId = button.getAttribute('data-hotel-id')
    const roomType = button.getAttribute('data-room-type')
    const roomId = button.getAttribute('data-room-id')
    const roomPrice = parseFloat(button.getAttribute('data-room-price'))

    // Update the modal's content.
    document.getElementById('modalHotelName').textContent = hotelName
    document.getElementById('modalRoomType').textContent = roomType
    document.getElementById('modalRoomPrice').textContent = formatRupiah(roomPrice)

    document.getElementById('hiddenHotelId').value = hotelId
    document.getElementById('hiddenRoomId').value = roomId

    // Reset form
    document.getElementById('bookingForm').reset()

    // Set min date to today for date inputs
    const today = new Date().toISOString().split('T')[0]
    document.getElementById('checkInDate').min = today
    document.getElementById('checkOutDate').min = today
  })

  // Handle CheckOut logic (must be after check in)
  const checkInInput = document.getElementById('checkInDate')
  const checkOutInput = document.getElementById('checkOutDate')

  if (checkInInput && checkOutInput) {
    checkInInput.addEventListener('change', function () {
      // Check out must be at least 1 day after check in
      let inDate = new Date(this.value)
      inDate.setDate(inDate.getDate() + 1)
      let nextDay = inDate.toISOString().split('T')[0]
      checkOutInput.min = nextDay
      if (checkOutInput.value && checkOutInput.value < nextDay) {
        checkOutInput.value = nextDay
      }
    })
  }

  // Handle Form Submit (Fake booking process)
  const bookingForm = document.getElementById('bookingForm')
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault()

      // In a real app we'd POST data
      const btn = this.querySelector('button[type="submit"]')
      const originalText = btn.textContent
      btn.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...'
      btn.disabled = true

      // Simulate network request
      setTimeout(() => {
        // Hide modal via Bootstrap JS API
        const bsModal = bootstrap.Modal.getInstance(bookingModalEl)
        if (bsModal) bsModal.hide()

        // Show success toast
        const toastEl = document.getElementById('bookingToast')
        if (toastEl) {
          const bsToast = new bootstrap.Toast(toastEl)
          bsToast.show()
        }

        // Reset button state
        btn.innerHTML = originalText
        btn.disabled = false
        bookingForm.reset()
      }, 1000)
    })
  }
}
