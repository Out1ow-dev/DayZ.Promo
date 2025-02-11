using System.Security.Claims;
using CrazyDayZ.Promo.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CrazyDayZ.Promo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager; // Используйте User вместо IdentityUser
        private readonly SignInManager<User> _signInManager;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User { UserName = model.Username };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");

                // Автоматически входим после регистрации
                await _signInManager.SignInAsync(user, isPersistent: true);

                return Ok(new { Message = "User registered successfully!" });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Нормализуем имя пользователя
            var normalizedUsername = model.Username.ToUpper();
            var user = await _userManager.FindByNameAsync(model.Username);
            
            if (user == null)
            {
                return Unauthorized(new { Message = "Invalid username or password" });
            }

            var result = await _signInManager.PasswordSignInAsync(
                user,
                model.Password,
                isPersistent: true,
                lockoutOnFailure: false
            );

            if (result.Succeeded)
            {
                // Проверяем роль пользователя
                var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
                if (!isAdmin)
                {
                    await _userManager.AddToRoleAsync(user, "Admin");
                }

                // Создаем claims для пользователя
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Role, "Admin")
                };

                // Создаем ClaimsIdentity
                var identity = new ClaimsIdentity(claims, IdentityConstants.ApplicationScheme);
                var principal = new ClaimsPrincipal(identity);

                // Выполняем вход
                await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme, principal);

                return Ok(new
                {
                    Message = "User logged in successfully!",
                    Username = user.UserName
                });
            }

            return Unauthorized(new { Message = "Invalid username or password" });
        }

        [HttpGet("check")]
        public IActionResult CheckAuth()
        {
            return Ok(new
            {
                isAuthenticated = User.Identity?.IsAuthenticated ?? false,
                username = User.Identity?.Name
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { Message = "User logged out successfully!" });
        }
    }
}
