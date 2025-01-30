import { Controller, Get, Param, Post, Query, Patch, Put, UsePipes, ValidationPipe, Body, Delete, UseGuards,Logger } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { ArticleResponseDto } from './dto/article-response.dto';
import { CreateArticleRequestDto } from './dto/create-article-request-dto';
import { UpdateArticleRequestDto } from './dto/update-article-request-dto';
import { ArticleStatusValidationPipe } from './pipes/article-stauts-validation.pipe';
import { ArticleStatus } from './article-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/user-role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { SearchArticleResponseDto } from './dto/search-article-response.dto';

@Controller('api/articles')
@UseGuards(AuthGuard(), RolesGuard)
export class ArticleController {
    private readonly logger = new Logger(ArticleService.name);

    // 생성자 주입
    constructor(private articleService: ArticleService) { }

    // 게시글 작성 기능
    @Post('/')
    async createArticle(@Body() createArticleRequestDto: CreateArticleRequestDto, @GetUser() logginedUser: User): Promise<ArticleResponseDto> {
        this.logger.verbose(`User:${logginedUser.username} is creating a new article with title: ${createArticleRequestDto.title}`);
        
        const articleResponseDto = new ArticleResponseDto(await this.articleService.createArticle(createArticleRequestDto, logginedUser))
        
        this.logger.verbose(`Article title with ${articleResponseDto.title} created Successfully`)
        return articleResponseDto;
    }

    // 게시글 조회 기능
    @Get('/')
    @Roles(UserRole.USER)//로그인 유저가 USER 만 접근 가능 
    async getAllArticles(): Promise<ArticleResponseDto[]> {
        this.logger.verbose(`Try to Retrieving all Articles`);

        const articles: Article[] = await this.articleService.getAllArticles(); // 비동기적으로 게시글 가져오기
        const articleResponseDto = articles.map(article => new ArticleResponseDto(article))
        
        this.logger.verbose(`Retrieved all Articles list Successfully`);

        return articleResponseDto;
    }
    //나의 게시글 조회 기능(로그인 유지지)
    @Get('/myarticles')
    async getMyAllArticles(@GetUser() logginedUser: User): Promise<ArticleResponseDto[]> {
        this.logger.verbose(`Try to Retrieving ${logginedUser.username}'s all Articles list`);
        
        const articles: Article[] = await this.articleService.getMyAllArticles(logginedUser); // 비동기적으로 게시글 가져오기
        const articleResponseDto = articles.map(article => new ArticleResponseDto(article))
        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Articles list Successfully`);

        return articleResponseDto;
    }

    // 특정 게시글 조회 기능
    @Get('/:id')
    async getArticleDetailById(@Param('id') id: number): Promise<ArticleResponseDto> {
        this.logger.verbose(`Try to Retrieving a article by id: ${id}`);

        const articleResponseDto = new ArticleResponseDto(await this.articleService.getArticleDetailById(id));
        this.logger.verbose(`Retrieved a article by ${id} details Successfully`);

        return articleResponseDto;
    }

    // 키워드(작성자)로 검색한 게시글 조회 기능
    @Get('/search/:keyword')
    async getArticlesByKeyword(@Query('author') author: string): Promise<SearchArticleResponseDto[]> {
        this.logger.verbose(`Try to Retrieving a article by author: ${author}`);

        const articles: Article[] = await this.articleService.getArticlesByKeyword(author);
        const searchArticleResponseDto = articles.map(article => new SearchArticleResponseDto(article));
        
        this.logger.verbose(`Retrieved articles list by ${author} details Successfully`);

        return searchArticleResponseDto;
    }

    // 특정 번호의 게시글 수정
    @Put('/:id')
    async updateArticleById(
        @Param('id') id: number,
        @Body() updateArticleRequestDto: UpdateArticleRequestDto,): Promise<ArticleResponseDto> {
        this.logger.verbose(`Try to Updating a article by id: ${id} with updatedArticleDto`);

        const updatedArticle = await this.articleService.updateArticleById(id, updateArticleRequestDto);
        
        this.logger.verbose(`Updated a article by ${id} Successfully`);

        return new ArticleResponseDto(updatedArticle);
    }

    // 특정 번호의 게시글 일부 수정<ADMIN 기능>
    @Patch('/:id/status')
    @Roles(UserRole.ADMIN)
    async updateArticleStatusById(
        @Param('id') id: number,
        @Body('status', ArticleStatusValidationPipe) status: ArticleStatus): Promise<void> {
        this.logger.verbose(` ADMING is trying to updating a article by id: ${id} with status: ${status}`);

        await this.articleService.updateArticleStatusById(id, status);

        this.logger.verbose(`ADMIN Updated a article's status to ${status} Successfully`);

    }

    // 게시글 삭제 기능
    @Delete('/:id')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async deleteArticleById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser.username}is trying to udeleting a article by id: ${id}`);

        await this.articleService.deleteArticleById(id, logginedUser);

        this.logger.verbose(`Deleted a article by to ${id} Successfully`);

    }
}