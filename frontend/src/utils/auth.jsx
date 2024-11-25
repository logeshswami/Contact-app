import axios from "axios";

//signup func
export const signup = async (formData) => {
  try {
    console.log(formData)
    const response = await axios.post("http://localhost:8080/signup", formData);

    if (response.data.status === "success") {
      return { success: true, message: response.data.message };
    }
    
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: error.response.data.error ||"Something went wrong. Please try again.",
    };
  }
};

//login func
export const login = async (formData) => {
  try {
    const response = await axios.post("http://localhost:8080/login", formData);
    console.log(response)

    if (response.data.IsAuth) {
      return { 
        success: true, 
        message: response.data.message, 
        userData: {
          userId: response.data.UserId,
          name: response.data.Name,
        },
      };
    } 

    return { success: false, message: "Invalid email or password" };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error ||"Something went wrong. Please try again.",
    };
  }
};

 



