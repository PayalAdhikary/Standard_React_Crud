using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static React_Crud.Controllers.CrudController;

namespace React_Crud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public class LoginModel
        {
            public string login_id { get; set; }
            public string Password { get; set; }
        }

        public class RoleModel
        {
            public Guid id { get; set; }
            public string role { get; set; }
        }

        [HttpPost("login")]
        public IActionResult LoginUser(LoginModel login)
        {

            try
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    connection.Open();

                    // Execute the stored procedure for user login
                    using (var command = new SqlCommand("dbo.UserLogin", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@login_id", login.login_id);
                        command.Parameters.AddWithValue("@password", login.Password);

                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                // User login successful
                                var userId = reader.GetGuid(reader.GetOrdinal("UserId"));
                                var name = reader["user_name"].ToString();
                                var dept = reader["dept"].ToString();
                                var token = GenerateJwtToken(userId);

                                return Ok(new { UserId = userId, name = name, Token = token, dept = dept });
                            }
                            else
                            {
                                // User login failed
                                return Unauthorized("Invalid email or password.");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log detailed error
                Console.WriteLine(ex.ToString());
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        private string GenerateJwtToken(Guid userId)
        {
            // Get the secret key and credentials for signing the JWT token
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Set expiration time for the new token (7 days from now)
            var expirationTime = DateTime.UtcNow.AddMinutes(7);

            // Here you could add logic to check if the current token is near expiration
            // However, this token generation method itself issues a new token

            var tokenDescriptor = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: new[] { new Claim(ClaimTypes.Name, userId.ToString()) },
                expires: expirationTime, // New expiration time
                signingCredentials: credentials
            );

            // Write the JWT token
            var jwtToken = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);

            // Print the token (for debugging purposes) and return it
            Console.WriteLine(jwtToken);
            return jwtToken;
        }

        [HttpGet("role")]
        public IActionResult GetRole()
        {
            try
            {

                List<RoleModel> role = new List<RoleModel>();

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    connection.Open();

                    using (var command = new SqlCommand("dbo.RoleGet", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        //command.Parameters.AddWithValue("@user_id", userId);

                        // Add OUTPUT parameter to capture the stored procedure message
                        // var outputParam = new SqlParameter("@Message", SqlDbType.NVarChar, 1000);
                        // outputParam.Direction = ParameterDirection.Output;
                        // command.Parameters.Add(outputParam);

                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    RoleModel color = new RoleModel
                                    {
                                        id = (Guid)reader["id"],
                                        role = (string)reader["role"]
                                    };

                                    role.Add(color);
                                }
                            }

                        }
                    }
                }


                if (role.Any())
                {
                    return Ok(role);
                }
                else
                {
                    return NotFound("No roles found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

    }
}
