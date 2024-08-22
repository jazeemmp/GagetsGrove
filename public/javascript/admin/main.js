
  document.addEventListener('DOMContentLoaded', function () {
    // Get the canvas element
    var ctx = document.getElementById('myChart').getContext('2d');

    // Create a new Chart instance
    var myChart = new Chart(ctx, {
      type: 'line', // Type of chart (line, bar, pie, etc.)
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'], // X-axis labels
        datasets: [{
          label: 'Sales Data', // Label for the dataset
          data: [65, 59, 80, 81, 56, 55, 40], // Data points for the chart
          borderColor: '#2e3135', // Line color
          pointStyle: 'circle', // Shape of the points
          backgroundColor: '#20202017', // Area color
          borderWidth: 3, // Line width
          tension: 0.4, // Curve the line
          fill:true
        }]
      },
      options: {
        plugins: {
            legend: {
              position: 'top', // Position of the legend
              align: 'center', // Center the legend items
              labels: {
                boxWidth: 20, // Width of the colored box
                padding: 15 // Padding between items
              }
            }
          },
        scales: {
          y: {
            beginAtZero: true // Start y-axis at zero
          }
        }
      }
    });
  });


  !(function (e) {
    "use strict";
    if (
      (e(".menu-item.has-submenu .menu-link").on("click", function (s) {
        s.preventDefault(),
          e(this).next(".submenu").is(":hidden") &&
            e(this)
              .parent(".has-submenu")
              .siblings()
              .find(".submenu")
              .slideUp(200),
          e(this).next(".submenu").slideToggle(200);
      }),
      e("[data-trigger]").on("click", function (s) {
        s.preventDefault(), s.stopPropagation();
        var n = e(this).attr("data-trigger");
        e(n).toggleClass("show"),
          e("body").toggleClass("offcanvas-active"),
          e(".screen-overlay").toggleClass("show");
      }),
      e(".screen-overlay, .btn-close").click(function (s) {
        e(".screen-overlay").removeClass("show"),
          e(".mobile-offcanvas, .show").removeClass("show"),
          e("body").removeClass("offcanvas-active");
      }),
      e(".btn-aside-minimize").on("click", function () {
        window.innerWidth < 768
          ? (e("body").removeClass("aside-mini"),
            e(".screen-overlay").removeClass("show"),
            e(".navbar-aside").removeClass("show"),
            e("body").removeClass("offcanvas-active"))
          : e("body").toggleClass("aside-mini");
      }),
      e(".select-nice").length && e(".select-nice").select2(),
      e("#offcanvas_aside").length)
    ) {
      const e = document.querySelector("#offcanvas_aside");
      new PerfectScrollbar(e);
    }
    e(".darkmode").on("click", function () {
      e("body").toggleClass("dark");
    });
  })(jQuery);
  