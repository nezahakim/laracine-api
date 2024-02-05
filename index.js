import express, { json, urlencoded } from "express";
import cors from "cors";
import multer from "multer";

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

import {db} from './config.js'


const App = express();


App.use(express.json());
App.use(cors());
App.use(urlencoded({ extended: true }));




App.get("/config", (req, res) => {
  if (db) {
    console.log("Server");
  }
});

App.get("/account/:id", (req, res) => {
  var id = req.params.id;
  var sql =
    `SELECT *, users.id as Uid FROM users INNER JOIN teachers ON users.id = teachers.user_id WHERE users.id ='` +
    id +
    `';`;

  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    if (data) {
      var values = {
        status: true,
        data: data[0],
      };
      return res.json(values);
    }
  });
});

App.post("/homework/add", (req, res) => {
  const dt = new Date();
  var id = Math.floor(Math.random() * 10000000);
  var course = req.body.course;
  var Class = req.body.class;
  var marks = req.body.marks;
  var sub_date = req.body.sub_date;
  var pre_date = dt.getFullYear() + "-" + dt.getMonth() + "-" + dt.getDate();
  var unique_id = req.body.unique_id;

  if (id && course && Class && marks && sub_date && pre_date && unique_id) {
    var sql =
      `INSERT INTO homeworks VALUES ('` +
      id +
      `','` +
      course +
      `','` +
      Class +
      `','` +
      marks +
      `','` +
      pre_date +
      `','` +
      sub_date +
      `','` +
      unique_id +
      `')`;
    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var values = {
          status: "true",
          id: id,
        };
        console.log(values);
        return res.json(values);
      }
    });
  } else {
    res.json("All input fields are required!");
    console.log("All input fields are required!");
  }
});

App.get("/homework/:id", (req, res) => {
  var id = req.params.id;
  var sql =
    `SELECT * FROM questions WHERE homework_id='` + id + `' ORDER BY id ASC;`;

  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});

App.get("/homeworks/:id", (req, res) => {
  var id = req.params.id;
  var sql =
    `SELECT * FROM homeworks 
                INNER JOIN users ON homeworks.author = users.id            
                INNER JOIN teachers ON homeworks.author = teachers.user_id 
                WHERE homeworks.id='${id}'; `;

  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});

App.get("/homeworks_id/:id", (req, res) => {
  var id = req.params.id;
  var sql = `SELECT * FROM homeworks WHERE id='` + id + `';`;

  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    if (data) {
      var values = {
        status: true,
        data: data,
      };
      return res.json(values);
    }
  });
});

App.get("/homeworks", (req, res) => {
  var id = req.params.id;
  var sql = `SELECT *,homeworks.id as Hid FROM homeworks 
                            INNER JOIN teachers ON homeworks.author = teachers.user_id 
                            INNER JOIN users ON homeworks.author = users.id ;`;

  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});

App.get("/question/:id", (req, res) => {
  var id = req.params.id;
  var sql = 'SELECT * FROM questions WHERE id = "' + id + '" ';

  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    if (data) {
      var values = {
        status: true,
        data: data,
      };
      return res.json(values);
    }
  });
});

App.post("/question/update/:id", (req, res) => {
  var id = req.params.id;
  var question = req.body.question;
  var marks = req.body.marks;

  if (id.length > 0 && question.length > 0 && marks.length > 0) {
    var sql =
      'UPDATE questions SET question = "' +
      question +
      '",marks = "' +
      marks +
      '"  WHERE id = "' +
      id +
      '" ';
    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var values = {
          status: true,
          data: data,
        };
        return res.json(values);
      }
    });
  } else {
    return res.json("All input fields are required!");
  }
});

App.post("/homework/update/:id", (req, res) => {
  var id = req.params.id;
  var course = req.body.course;
  var Class = req.body.class;
  var marks = req.body.marks;
  var sub_date = req.body.sub_date;

  if (
    id.length > 0 &&
    Class.length > 0 &&
    marks.length > 0 &&
    course.length > 0 &&
    typeof sub_date != null
  ) {
    var sql =
      'UPDATE homeworks SET class = "' +
      Class +
      '",marks = "' +
      marks +
      '",course = "' +
      course +
      '",sub_data="' +
      sub_date +
      '"  WHERE id = "' +
      id +
      '" ';
    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var values = {
          status: true,
          data: data,
        };
        return res.json(values);
      }
    });
  } else {
    return res.json("All input fields are required!");
  }
});

App.get("/homework/delete/:id", (req, res) => {
  var id = req.params.id;

  if (id.length > 0) {
    var sql = 'DELETE FROM questions WHERE homework_id = "' + id + '" ';
    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var sql = 'DELETE FROM homeworks WHERE id = "' + id + '" ';
        db.query(sql, (error, datas) => {
          if (error) return console.log(error);
          if (datas) {
            var values = {
              status: true,
              data: datas,
            };
            return res.json(values);
          }
        });
      }
    });
  } else {
    return res.json("All input fields are required!");
  }
});

App.get("/question/delete/:id", (req, res) => {
  var id = req.params.id;

  if (id.length > 0) {
    var sql = 'DELETE FROM questions WHERE id = "' + id + '" ';
    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var values = {
          status: true,
          data: "Success",
        };
        return res.json(values);
      }
    });
  } else {
    return res.json("All input fields are required!");
  }
});

App.post("/question/add", (req, res) => {
  // var id = Math.floor(Math.random() * 10000000)
  var question = req.body.question;
  var marks = req.body.marks;
  var homework_id = req.body.homework_id;

  if (question.length > 0 && marks.length > 0 && homework_id.length > 0) {
    var sql =
      `INSERT INTO questions(question, marks, homework_id) VALUES ('` +
      question +
      `','` +
      marks +
      `','` +
      homework_id +
      `')`;

    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var values = {
          status: "true",
          id: homework_id,
        };
        console.log(values);
        return res.json(values);
      }
    });
  } else {
    return res.json("All input fields are required");
  }
});

App.get("/announcements", (req, res) => {
  var sql = `SELECT *,announcements.title as Atitle,announcements.id as AId FROM announcements 
                            INNER JOIN users ON announcements.who_announce = users.id ORDER BY announcements.id DESC;`;

  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});
App.get("/announcements/:id", (req, res) => {
  var id = req.params.id;
  var sql = `SELECT *,announcements.title as Atitle,announcements.id as Aid FROM announcements 
                            INNER JOIN users ON announcements.who_announce = users.id WHERE announcements.id = ${id} ORDER BY announcements.id = ${id} DESC ;`;

  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});

App.post("/announcements/add", (req, res) => {
  const dt = new Date();
  // var id = Math.floor(Math.random() * 10000000)
  var announcement = req.body.announcement;
  var title = req.body.title;
  var who_announce = req.body.who_announce;
  var dates = dt.getMonth() + "-" + dt.getDate() + "-" + dt.getFullYear();

  if (announcement != "" > 0 && title != "" && who_announce != 0) {
    var sql = `INSERT INTO announcements(title,dates, announcement, who_announce) VALUES ('${title}','${dates}','${announcement}','${who_announce}')`;

    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var values = {
          status: "true",
          id: "row added",
        };
        console.log(values);
        return res.json(values);
      }
    });
  } else {
    return res.json("All input fields are required");
  }
});

App.post("/announcements/update/:id", (req, res) => {
  var id = req.params.id;
  var announcement = req.body.announcement;
  var title = req.body.title;

  if (id.length > 0 && question.length > 0 && marks.length > 0) {
    var sql =
      'UPDATE announcements SET announcement = "' +
      announcement +
      '",title = "' +
      title +
      '"  WHERE id = "' +
      id +
      '" ';
    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var values = {
          status: true,
          data: data,
        };
        return res.json(values);
      }
    });
  } else {
    return res.json("All input fields are required!");
  }
});

App.post("/students/update/:id", (req, res) => {
  var id = req.params.id;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var phone = req.body.phone;
  var Class = req.body.class;
  var gender = new String(req.body.gender).toLowerCase();
  var dob = req.body.dob;
  console.log(gender);
  console.log(fname);
  console.log(lname);
  console.log(phone);

  if (gender == "male" || gender == "female") {
    var sql = `UPDATE students SET gender = '${gender}', first_name = '${fname}', last_name = '${lname}', parent_phone = '${phone}', grade_level = '${Class}', date_of_birth = '${dob}' WHERE student_id = '${id}' `;
    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var values = {
          status: true,
          data: data,
        };
        return res.json(values);
      }
    });
  } else {
    return res.json("Please Gender Must be Male or Female");
  }
});

App.get("/student/delete/:id", (req, res) => {
  var id = req.params.id;
  if (id.length > 0) {
    var sql = `DELETE FROM students WHERE student_id = ${id}`;
    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      else {
        var values = {
          status: true,
          data: data,
        };
        return res.json(values);
      }
    });
  } else {
    return res.json("All input fields are required!");
  }
});

App.get("/students", (req, res) => {
  var sql = `SELECT * FROM students;`;
  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});

App.get("/students/id/:id", (req, res) => {
  var id = req.params.id;
  var sql = `SELECT * FROM students WHERE student_id = ${id};`;
  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    var values = {
      status: true,
      data: data,
    };
    return res.json(values);
  });
});

App.get("/students/:id", (req, res) => {
  var id = new String(req.params.id);
  var sql = `SELECT * FROM students WHERE first_name LIKE '%${id}%' OR last_name LIKE '%${id}%' OR student_id LIKE '%${id}%'  ;`;
  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    if (data) {
      return res.json(data);
    }
  });
});

App.post("/students/add", (req, res) => {
  const dt = new Date();
  // var id = Math.floor(Math.random() * 10000000)
  var fname = req.body.fname;
  var lname = req.body.lname;
  var phone = req.body.phone;
  var Class = req.body.class;
  var gender = new String(req.body.gender).toLowerCase();
  var dob = req.body.dob;
  var join_date = dt.getMonth() + "-" + dt.getDate() + "-" + dt.getFullYear();

  if (gender == "male" || gender == "female") {
    var sql = `INSERT INTO students(first_name,last_name, parent_phone, gender, date_of_birth,grade_level,join_date) VALUES ('${fname}','${lname}','${phone}','${gender}','${dob}','${Class}','${join_date}')`;

    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var values = {
          status: "true",
          id: "row added",
        };
        console.log(values);
        return res.json(values);
      }
    });
  } else {
    return res.json("Please Gender Must be Male or Female");
  }
});

App.post("/teachers/add", (req, res) => {
  var names = req.body.names;
  var email = req.body.email;
  var phone_number = req.body.phone_number;
  var gender = new String(req.body.gender).toLowerCase();
  var password = req.body.password;
  var title = req.body.title;
  var subject_taught = req.body.subject_taught;
  var id = Math.floor(Math.random() * 10);

  if (gender == "male" || gender == "female") {
    var sql = `INSERT INTO users(id,names,email, phone_number, gender, password,title) VALUES ('${id}','${names}','${email}','${phone_number}','${gender}','${password}','${title}')`;

    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var sql = `INSERT INTO teachers(user_id,subject_taught) VALUES ('${id}','${subject_taught}')`;

        db.query(sql, (err, data) => {
          if (err) return console.log(err);
          if (data) {
            var values = {
              status: "true",
              id: "row added",
            };
            console.log(values);
            return res.json(values);
          }
        });
      }
    });
  } else {
    return res.json("Please Gender Must be Male or Female");
  }
});

App.post("/teachers/update/:id", (req, res) => {
  var id = req.params.id;
  var names = new String(req.body.names);
  var email = req.body.email;
  var phone_number = req.body.phone_number;
  var gender = new String(req.body.gender).toLowerCase();
  var password = req.body.password;
  var title = req.body.title;
  var subject_taught = req.body.subject_taught;

  if (gender == "male" || gender == "female") {
    var sql = `UPDATE users SET gender = '${gender}', names = '${names}', email = '${email}', phone_number = '${phone_number}', password = '${password}', title = '${title}' WHERE id = '${id}' `;
    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var sql = `UPDATE teachers SET subject_taught = '${subject_taught}' WHERE user_id = '${id}' `;

        db.query(sql, (err, data) => {
          if (err) return console.log(err);
          if (data) {
            var values = {
              status: true,
              data: data,
            };
            return res.json(values);
          }
        });
      }
    });
  } else {
    return res.json("Please Gender Must be Male or Female");
  }
});

App.get("/teachers/delete/:id", (req, res) => {
  var id = req.params.id;
  if (id.length > 0) {
    var sql = `DELETE FROM teachers WHERE user_id = ${id}`;
    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      else {
        var sql = `DELETE FROM users WHERE id = ${id}`;
        db.query(sql, (err, data) => {
          if (err) return console.log(err);
          else {
            var values = {
              status: true,
              data: data,
            };
            return res.json(values);
          }
        });
      }
    });
  } else {
    return res.json("All input fields are required!");
  }
});

App.get("/teachers/id/:id", (req, res) => {
  var id = req.params.id;
  var sql = `SELECT * FROM users INNER JOIN teachers ON users.id = teachers.user_id WHERE users.id = ${id};`;
  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    var values = {
      status: true,
      data: data,
    };
    return res.json(values);
  });
});

App.get("/teachers", (req, res) => {
  var sql = `SELECT *,users.id as UID FROM users LEFT JOIN teachers ON users.id = teachers.user_id;`;
  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});

App.get("/teachers/:id", (req, res) => {
  var id = new String(req.params.id);
  var sql = `SELECT * FROM users LEFT JOIN teachers ON users.id = teachers.user_id WHERE names LIKE '%${id}%' OR email LIKE '%${id}%' OR phone_number LIKE '%${id}%'  ;`;
  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    if (data) {
      return res.json(data);
    }
  });
});

App.get("/comments/:id", (req, res) => {
  var id = req.params.id;
  var sql = `SELECT * FROM comments INNER JOIN users ON comments.who_comment = users.id WHERE comments.activity_id = ${id} ORDER BY comments.id = ${id} DESC ;`;

  db.query(sql, (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});

App.post("/comments/add", (req, res) => {
  // const dt = new Date();
  // var id = Math.floor(Math.random() * 10000000)
  var activity_id = req.body.activity_id;
  var who_comment = req.body.who_comment;
  var comment = req.body.comment;
  // var dates = dt.getMonth() + "-" + dt.getDate() + "-" + dt.getFullYear();

  if (comment != "" > 0 && activity_id != "" && who_comment != 0) {
    var sql = `INSERT INTO comments(activity_id,who_comment, comment) VALUES ('${activity_id}','${who_comment}','${comment}')`;

    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data) {
        var values = {
          status: "true",
          id: "row added",
        };
        console.log(values);
        return res.json(values);
      }
    });
  } else {
    console.log(activity_id, comment, who_comment);
    return res.json("All input fields are required");
  }
});

App.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  if (email && password) {
    var sql =
      `SELECT * FROM users WHERE email = '` +
      email +
      `' and password = '` +
      password +
      `'`;
    db.query(sql, (err, data) => {
      if (err) return console.log(err);
      if (data.length != 1) return res.json("email or password are Incorect!");
      else {
        var userId = data[0].id;
        var values = {
          status: true,
          userId: { userId: userId, title: data[0].title },
        };
        return res.json(values);
      }
    });
  } else {
    res.json("All inputs are required!");
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './Data/reports');
  },
  filename: function (req, file, cb) {
    return cb(null,`${Date.now()}_${ file.originalname}`);
  }
});
const upload = multer({ storage });

App.post('/reports/add', upload.single('file'), (req, res) => {
  const dt = new Date();
  const join_date = `${dt.getMonth() + 1}-${dt.getDate()}-${dt.getFullYear()}`;

  const file = req.file;
  const term = req.body.term;
  const grade_level = req.body.grade_level;
  const year = req.body.year;
  const student_id = req.body.student_id;

  if (term && year && grade_level) {
    if (!req.file) {

      console.log('No file uploaded.');
      return res.json({ message: 'No file uploaded.' });

    }else{

    const sql = `SELECT * FROM reports INNER JOIN students ON reports.student_id = students.student_id WHERE reports.student_id = ${student_id} AND reports.year = ${year}`;
    db.query(sql, (err, datai) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }

      if (datai && datai.length > 0) {
        const updateSql = `UPDATE reports SET ${term}='${file.filename}', year='${year}' WHERE student_id = ${student_id}`;
        db.query(updateSql, (err, data) => {
          if (err) {
            console.error(err);
            return res.json({ status: 'error', message: 'Error updating report' });
          }
          return res.json({ status: 'success', message: 'row updated' });
        });
      } else {
        const insertSql = `INSERT INTO reports(student_id, ${term}, grade_level, year) VALUES ('${student_id}', '${file.filename}', '${grade_level}', '${year}')`;
        db.query(insertSql, (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ status: 'error', message: 'Error inserting report' });
          }
          return res.json({ status: 'success', message: 'row added' });
        });
      }
    });

  }

  } else {
    return res.json({ status: 'error', message: 'Please enter term and year' });
  }

});

App.get('/reports/:id',(req,res)=>{
  const student_id =  req.params.id

  const sql = `SELECT *,reports.grade_level as RGL FROM reports INNER JOIN students ON reports.student_id = students.student_id WHERE reports.student_id = ${student_id} ORDER BY year DESC`;
  db.query(sql,(err,data)=>{
    if(err) console.log(err)
    return res.json(data)
  })

})

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

App.use('/reports/view', express.static(join(__dirname, './Data/reports')));


const PORT = process.env.PORT
App.listen(8000, () => {
  console.log("Connected to Server! at MYSQL PORT: "+ PORT );
});
