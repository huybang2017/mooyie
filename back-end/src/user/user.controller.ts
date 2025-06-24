import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from 'src/user/user.service';
import { ChangePasswordDto } from 'src/user/dto/change-password.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Get(':id/history')
  getWatchHistory(@Param('id') id: string) {
    return this.userService.getWatchHistory(id);
  }

  @Get(':id/bookings')
  getBookings(@Param('id') id: string) {
    return this.userService.getUserBookings(id);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.userService.getUserComments(id);
  }

  @Get(':id/bookmarks')
  getBookmarks(@Param('id') id: string) {
    return this.userService.getUserBookmarks(id);
  }

  @Patch(':id/change-password')
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(id, dto);
  }
}
