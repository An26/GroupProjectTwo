CREATE DATABASE resume_builder;
USE resume_builder;
CREATE TABLE user(	
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	phone varchar(12) NOT NULL,
	street varchar(300) NOT NULL,
	rest varchar(300) NOT NULL,
	github varchar(255),
	summary varchar(5000) NOT NULL,
	skills varchar(3000) NOT NULL,
	password varchar(255) NOT NULL,
	PRIMARY KEY (id)
	);
CREATE TABLE education(
	id int NOT NULL AUTO_INCREMENT,
	schoolName varchar(255) NOT NULL,
	location varchar(255) NOT NULL,
	major varchar(255) NOT NULL,
	degree varchar(255) NOT NULL,
	years varchar(300) NOT NULL,
	GPA varchar(300) NOT NULL,
	honors varchar(500),
	PRIMARY KEY (id),
	userId init,
	FOREIGN KEY (userId) REFERENCES user(id)
);
CREATE TABLE work(
	id int NOT NULL AUTO_INCREMENT,
	companyName varchar(255) NOT NULL,
	location varchar(255) NOT NULL,
	title varchar(255) NOT NULL,
	years varchar(255) NOT NULL,
	responsibilities varchar(3000) NOT NULL,
	duties varchar(3000) NOT NULL,
	PRIMARY KEY (id),
	userId init,
	FOREIGN KEY (userId) REFERENCES user(id)
);
CREATE TABLE project(
	id int NOT NULL AUTO_INCREMENT,
	projectName varchar(255) NOT NULL,
	description varchar(1000) NOT NULL,
	url varchar(255) NOT NULL,
	dates varchar(300) NOT NULL,
	PRIMARY KEY (id),
	userId init,
	FOREIGN KEY (userId) REFERENCES user(id)
);
