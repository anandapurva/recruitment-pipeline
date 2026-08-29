CREATE DATABASE recruitment_pipeline;

USE recruitment_pipeline;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('recruiter', 'interviewer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_openings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT,
    status ENUM('open', 'closed', 'archived') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,

    job_opening_id INT NOT NULL,

    candidate_name VARCHAR(150) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    source VARCHAR(100),
    notes TEXT,

    stage ENUM(
        'Applied',
        'Screening',
        'Interview',
        'Offer',
        'Hired',
        'Rejected'
    ) NOT NULL DEFAULT 'Applied',

    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    stage_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    rejected_from_stage ENUM(
        'Applied',
        'Screening',
        'Interview',
        'Offer',
        'Hired'
    ) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (job_opening_id)
        REFERENCES job_openings(id)
        ON DELETE RESTRICT
);

CREATE TABLE application_interviewers (
    application_id INT NOT NULL,
    interviewer_id INT NOT NULL,

    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (application_id, interviewer_id),

    FOREIGN KEY (application_id)
        REFERENCES applications(id)
        ON DELETE CASCADE,

    FOREIGN KEY (interviewer_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);

CREATE TABLE application_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    application_id INT NOT NULL,

    event_type ENUM(
        'CREATED',
        'STAGE_CHANGED',
        'REJECTED',
        'REINSTATED',
        'FEEDBACK_ADDED'
    ) NOT NULL,

    old_stage VARCHAR(30),
    new_stage VARCHAR(30),

    performed_by INT NULL,

    feedback TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (application_id)
        REFERENCES applications(id)
        ON DELETE CASCADE,

    FOREIGN KEY (performed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE stalled_alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    application_id INT NOT NULL,

    stage VARCHAR(30) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    dismissed_at TIMESTAMP NULL,

    FOREIGN KEY (application_id)
        REFERENCES applications(id)
        ON DELETE CASCADE
);

