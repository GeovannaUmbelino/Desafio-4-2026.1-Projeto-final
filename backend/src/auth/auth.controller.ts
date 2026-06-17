import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Roles, CurrentUser, Public } from '../common/decorators';
import { User, UserRole } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Public()
  @Post('register')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads/perfis',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Apenas imagens nos formatos JPG, JPEG ou PNG são permitidas!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async register(
    @Body() dto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    let fotoUrl: string | null = null;
    if (file) {
      fotoUrl = `http://localhost:3001/uploads/perfis/${file.filename}`;
    }

    return this.authService.register({ ...dto, fotoUrl });
  }

  // valida credenciais
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // retorna dados do usuário logado
  @Get('profile')
  @Roles(UserRole.ALUNO, UserRole.PROFESSOR, UserRole.ADMIN)
  async getProfile(@CurrentUser() user: User) {
    return this.authService.getProfile(user.id);
  }

  // exclui a conta do usuário logado
  @Delete('delete-account')
  @Roles(UserRole.ALUNO, UserRole.PROFESSOR, UserRole.ADMIN)
  async deleteAccount(@CurrentUser() user: User) {
    return this.authService.deleteAccount(user.id);
  }
}