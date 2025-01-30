import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleStatus } from './article-status.enum';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Article {
    @PrimaryGeneratedColumn() //PK + Auto Increment
    id: number;

    @Column() //General Column
    author: string;

    @Column()
    title: string;

    @Column()
    contents: string;

    @Column()
    status: ArticleStatus;

    @ManyToOne(Type => User, user=>user.articles ,{eager: true}) // == lazy loading 상태태
    user:User;
}