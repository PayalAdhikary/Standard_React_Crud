using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace React_Crud.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CrudController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CrudController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public class getEmployee
        {
            public Guid id { get; set; }
            public string name { get; set; }
            public string email { get; set; }
            public string mobile { get; set; }
            public string img { get; set; }
            public Guid role_id { get; set; }
            public string role { get; set; }
        }

        public class postEmployee
        {
            public string name { get; set; }
            public string email { get; set; }
            public string mobile { get; set; }
            public string img { get; set; }
            public Guid role_id { get; set; }
        }
        public class editEmployee
        {
            public Guid id { get; set; }
            public string name { get; set; }
            public string email { get; set; }
            public string mobile { get; set; }
            public string img { get; set; }
            public Guid role_id { get; set; }
        }

        public class deleteEmployee
        {
            public Guid id { get; set; }
        }
        [HttpGet]
        public IActionResult GetEmployees()
        {
            try
            {

                List<getEmployee> employees = new List<getEmployee>();

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    connection.Open();

                    using (var command = new SqlCommand("dbo.UserGet", connection))
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
                                    getEmployee color = new getEmployee
                                    {
                                        id = (Guid)reader["id"],
                                        name = (string)reader["name"],
                                        mobile = (string)reader["mobile"],
                                        email = (string)reader["email"],
                                        role_id = (Guid)reader["role_id"],
                                        role = (string)reader["role"],
                                        img = (string)reader["img"]
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
                    return NotFound("No users found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetEmployeeById(Guid id)
        {
            try
            {

                List<getEmployee> employees = new List<getEmployee>();

                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    connection.Open();

                    using (var command = new SqlCommand("dbo.UserGetById", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@id", id);

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
                                    getEmployee color = new getEmployee
                                    {
                                        id = (Guid)reader["id"],
                                        name = (string)reader["name"],
                                        mobile = (string)reader["mobile"],
                                        email = (string)reader["email"],
                                        role_id = (Guid)reader["role_id"],
                                        role = (string)reader["role"],
                                        img = (string)reader["img"]

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
                    return NotFound("No employees found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost("addEmployee")]
        public IActionResult AddEmployee(postEmployee postEmployee)
        {
            try
            {
                string message;
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    connection.Open();

                    using (var command = new SqlCommand("dbo.UserInsert", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        //command.Parameters.AddWithValue("@user_id", postColor.user_id);
                        command.Parameters.AddWithValue("@name", postEmployee.name);
                        command.Parameters.AddWithValue("@email", postEmployee.email);
                        command.Parameters.AddWithValue("@mobile_no", postEmployee.mobile);
                        command.Parameters.AddWithValue("@img", postEmployee.img);
                        command.Parameters.AddWithValue("@role_id", postEmployee.role_id);



                        // Add OUTPUT parameter to capture the stored procedure message
                        var outputParam = new SqlParameter("@Message", SqlDbType.NVarChar, 1000);
                        outputParam.Direction = ParameterDirection.Output;
                        command.Parameters.Add(outputParam);

                        // Execute the stored procedure
                        command.ExecuteNonQuery();

                        // Get the message from the output parameter
                        message = command.Parameters["@Message"].Value.ToString();
                    }
                }

                // Check the message returned by the stored procedure
                if (message.StartsWith("User inserted successfully"))
                {
                    return Ok(new { ExecuteMessage = message });
                }
                else
                {
                    return BadRequest(message); // Return error message
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPut("edit")]
        public IActionResult EditItemCategory( [FromBody] editEmployee editEmp)
        {
            try
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    connection.Open();

                    using (var command = new SqlCommand("dbo.UserUpdate", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@id", editEmp.id);
                        command.Parameters.AddWithValue("@name", editEmp.name);
                        command.Parameters.AddWithValue("@email", editEmp.email);
                        command.Parameters.AddWithValue("@mobile", editEmp.mobile);
                        command.Parameters.AddWithValue("@role_id", editEmp.role_id);
                        command.Parameters.AddWithValue("@img", editEmp.img);

                        // Execute the stored procedure
                        var successMessageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 500)
                        {
                            Direction = ParameterDirection.Output
                        };
                        var errorMessageParam = new SqlParameter("@ErrorMessage", SqlDbType.NVarChar, 500)
                        {
                            Direction = ParameterDirection.Output
                        };

                        command.Parameters.Add(successMessageParam);
                        command.Parameters.Add(errorMessageParam);

                        command.ExecuteNonQuery();

                        string successMessage = successMessageParam.Value?.ToString();
                        string errorMessage = errorMessageParam.Value?.ToString();

                        if (!string.IsNullOrEmpty(errorMessage))
                        {
                            return StatusCode(400, errorMessage); // Return bad request with error message
                        }
                        else if (!string.IsNullOrEmpty(successMessage))
                        {
                            return Ok(new { ExecuteMessage = successMessage }); // Return success message
                        }
                        else
                        {
                            return StatusCode(500, "Error: No response from the database."); // No response from database
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}"); // Internal server error
            }
        }

        [HttpPut("delete")]
        public IActionResult DeleteEmployee([FromBody] deleteEmployee delEmp)
        {
            try
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    connection.Open();

                    using (var command = new SqlCommand("dbo.UserDelete", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@id", delEmp.id);

                        // Define output parameter for message
                        var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 1000)
                        {
                            Direction = ParameterDirection.Output
                        };

                        command.Parameters.Add(messageParam);

                        command.ExecuteNonQuery();

                        string message = messageParam.Value?.ToString();

                        if (!string.IsNullOrEmpty(message) && message.StartsWith("Employee deleted successfully"))
                        {
                            return Ok(new { ExecuteMessage = message }); // Return success message
                        }
                        else
                        {
                            return StatusCode(400, message); // Return bad request with error message
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}"); // Internal server error
            }
        }


    }
}
