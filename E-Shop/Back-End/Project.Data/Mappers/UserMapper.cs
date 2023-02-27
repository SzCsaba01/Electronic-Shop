using Project.Data.Dto.User;
using Project.Data.Enities;

namespace Project.Data.Mappers;
public static class UserMapper {
    public static User ToUser(this UserRegisterDto userDto) {
        return new User {
            Email = userDto.Email,
            Username = userDto.Username,
            Password = userDto.Password,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Address = userDto.Address,
            PhoneNumber = userDto.PhoneNumber,
            State = userDto.State,
            Country = userDto.Country, 
            City = userDto.City,
        };
    }
    
    public static UserProfileDetailsDto UserToDto(this User user) {
        return new UserProfileDetailsDto {
            Username = user.Username,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Address = user.Address,
            PhoneNumber = user.PhoneNumber,
            State = user.State,
            Country = user.Country,
            City = user.City,

        };
    }

    public static void EditUser(this User user, EditUserDto editUserDto) {
        user.FirstName = editUserDto.FirstName;
        user.LastName = editUserDto.LastName;
        user.Email = editUserDto.Email;
        user.Address = editUserDto.Address;
        user.PhoneNumber = editUserDto.PhoneNumber;
        user.Username = editUserDto.Username;
        user.Country = editUserDto.Country;
        user.State = editUserDto.State;
        user.Country = editUserDto.Country;
    }
}
