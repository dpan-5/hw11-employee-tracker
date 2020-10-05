USE employee_db;

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer I", 105000.90, 1), 
("Software Engineer II", 135000.50, 1), 
("Principal Architect", 420000, 1),
("FP&A Analyst", 70000.29, 2),
("HR BP", 99000, 3),
("Marketing Manager", 119000, 4);

SELECT * FROM role;