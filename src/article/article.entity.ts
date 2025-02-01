import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleStatus } from './article-status.enum';
import { User } from 'src/user/entities/user.entity';
import { CommonEntity } from 'src/common/entites/common.entity';

@Entity()
export class Article extends CommonEntity{
    @Column() 
    author: string;

    @Column()
    title: string;

    @Column()
    contents: string;

    @Column()
    status: ArticleStatus;

    @ManyToOne(Type => User, user=>user.articles ,{eager: true}) 
    user:User;
}