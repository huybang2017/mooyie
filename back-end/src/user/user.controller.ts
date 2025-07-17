import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  NotFoundException,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from 'src/user/user.service';
import { ChangePasswordDto } from 'src/user/dto/change-password.dto';
import { ApiBasicAuth, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorate/roles.decorator';
import { Role } from 'generated/prisma';
import { FilterUserDto } from 'src/user/dto/fitler-user.dto';
import { PaginationUserDto } from 'src/user/dto/pagination-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBasicAuth('access-token')
  @Get('admin')
  @ApiOperation({ summary: 'Get all users for admin' })
  async getAllUsers(
    @Query() filter: FilterUserDto,
    @Query() pagination: PaginationUserDto,
  ) {
    return this.userService.findAllAdmin(filter, pagination);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Change the status of a user account' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'boolean',
          description: 'New status of the user account',
        },
      },
    },
  })
  async changeStatusAccount(
    @Param('id') id: string,
    @Body('status') status: boolean,
  ) {
    try {
      const updatedUser = await this.userService.changeStatusAccount(
        id,
        status,
      );
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update user status');
    }
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
