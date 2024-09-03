using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using TechNationEx.Models;

namespace TechNationEx.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            ViewData["ActivePage"] = "Dashboard";
            return View();
        }

        [HttpGet("NotasEmitidas")]
        public IActionResult NotasEmitidas()
        {
            ViewData["ActivePage"] = "NotasEmitidas";
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
