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

ALTER TABLE applications
ADD COLUMN stage_started_at DATETIME
    NOT NULL DEFAULT CURRENT_TIMESTAMP;

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

SELECT id, name, email, password_hash, role
FROM users;

CREATE INDEX idx_job_openings_status
ON job_openings(status);

CREATE INDEX idx_applications_job
ON applications(job_opening_id);

CREATE INDEX idx_applications_stage
ON applications(stage);

CREATE INDEX idx_applications_applied_at
ON applications(applied_at);

CREATE INDEX idx_applications_stage_changed
ON applications(stage_changed_at);

CREATE INDEX idx_applications_job
ON applications(job_opening_id);

CREATE INDEX idx_application_interviewers_interviewer
ON application_interviewers(interviewer_id);

CREATE INDEX idx_applications_stage_applied
ON applications(stage, applied_at);

CREATE INDEX idx_history_event_stage_date
ON application_history(event_type, new_stage, created_at);

-- Check the history
SELECT
    id,
    application_id,
    event_type,
    old_stage,
    new_stage,
    performed_by,
    created_at
FROM application_history
WHERE application_id = 2
ORDER BY created_at;

-- Chcek applications in MySQL
SELECT
    id,
    job_opening_id,
    candidate_name,
    candidate_email,
    stage
FROM applications
ORDER BY id;

CREATE TABLE interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,

    application_id INT NOT NULL,

    scheduled_at DATETIME NOT NULL,

    duration_minutes INT DEFAULT 60,

    location VARCHAR(255),

    notes TEXT,

    created_by INT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_interview_application
        FOREIGN KEY (application_id)
        REFERENCES applications(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_interview_creator
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    INDEX idx_interviews_scheduled_at (scheduled_at),
    INDEX idx_interviews_application (application_id)
);

CREATE TABLE stalled_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    application_id INT NOT NULL,

    stage VARCHAR(50) NOT NULL,

    stage_started_at DATETIME NOT NULL,

    dismissed_at DATETIME NULL,

    dismissed_by INT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stalled_alert_application
        FOREIGN KEY (application_id)
        REFERENCES applications(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_stalled_alert_dismissed_by
        FOREIGN KEY (dismissed_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    INDEX idx_stalled_alert_application (
        application_id
    ),

    INDEX idx_stalled_alert_active (
        application_id,
        stage,
        stage_started_at
    )
);

UPDATE applications
SET stage_started_at =
    DATE_SUB(NOW(), INTERVAL 11 DAY)
WHERE id = 2;

ALTER TABLE stalled_alerts
ADD CONSTRAINT uq_stalled_alert_stage_instance
UNIQUE (
    application_id,
    stage,
    stage_started_at
);



SELECT
    id,
    candidate_name,
    stage,
    stage_started_at
FROM applications;

SELECT * FROM stalled_alerts;

UPDATE applications
SET stage_started_at = DATE_SUB(NOW(), INTERVAL 11 DAY)
WHERE id = 4;

SELECT
    id,
    candidate_name,
    stage,
    stage_started_at
FROM applications
WHERE id = 4;