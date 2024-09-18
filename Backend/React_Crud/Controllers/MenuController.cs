using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static React_Crud.Controllers.CrudController;
using System.Data;
using System.Data.SqlClient;

namespace React_Crud.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public MenuController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public class getMenu
        {
            public Guid id { get; set; }
            public string menu { get; set; }
        }

        public class getSubMenu
        {
            public Guid id { get; set; }
            public Guid menu_id { get; set; }
            public string submenu { get; set; }
            public Guid user_id { get; set; }
            public string url { get; set; }
        }

        public class Sub
        {
            public Guid menu_id { get; set; }
            public Guid user_id { get; set; }
        }

        [HttpGet]
        public IActionResult GetMenu()
        {
            try
            {

                List<getMenu> employees = new List<getMenu>();

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    connection.Open();

                    using (var command = new SqlCommand("dbo.MenuGet", connection))
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
                                    getMenu color = new getMenu
                                    {
                                        id = (Guid)reader["id"],
                                        menu = (string)reader["menu"]
                                    };

                                    employees.Add(color);
                                }
                            }

                        }
                    }
                }


                if (employees.Any())
                {
                    return Ok(employees);
                }
                else
                {
                    return NotFound("No menus found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost("submenu")]
        public IActionResult GetSubMenu([FromBody] Sub sub)
        {
            try
            {

                List<getSubMenu> employees = new List<getSubMenu>();

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    connection.Open();

                    using (var command = new SqlCommand("dbo.SubMenuGet", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@menu_id", sub.menu_id);
                        command.Parameters.AddWithValue("@user_id", sub.user_id);

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
                                    getSubMenu color = new getSubMenu
                                    {
                                        id = (Guid)reader["id"],
                                        menu_id = (Guid)reader["menu_id"],
                                        submenu = (string)reader["submenu"],
                                        user_id = (Guid)reader["user_id"],
                                        url = (string)reader["url"]
                                    };

                                    employees.Add(color);
                                }
                            }

                        }
                    }
                }


                if (employees.Any())
                {
                    return Ok(employees);
                }
                else
                {
                    return NotFound("No sub menus found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
