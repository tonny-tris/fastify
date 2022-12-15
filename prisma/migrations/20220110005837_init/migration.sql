-- CreateTable
CREATE TABLE `absensi_sma3bondowoso` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `siswa_id` VARCHAR(25) NOT NULL,
    `tanggal` DATE NOT NULL,
    `masuk` TIME(0) NOT NULL,
    `pulang` TIME(0) NOT NULL,
    `stamp` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FKabsSiswaID`(`siswa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_assignment` (
    `item_name` VARCHAR(64) NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `created_at` INTEGER NULL,

    INDEX `idx-auth_assignment-user_id`(`user_id`),
    PRIMARY KEY (`item_name`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_item` (
    `name` VARCHAR(64) NOT NULL,
    `type` SMALLINT NOT NULL,
    `description` TEXT NULL,
    `rule_name` VARCHAR(64) NULL,
    `data` BLOB NULL,
    `created_at` INTEGER NULL,
    `updated_at` INTEGER NULL,

    INDEX `idx-auth_item-type`(`type`),
    INDEX `rule_name`(`rule_name`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_item_child` (
    `parent` VARCHAR(64) NOT NULL,
    `child` VARCHAR(64) NOT NULL,

    INDEX `child`(`child`),
    PRIMARY KEY (`parent`, `child`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_rule` (
    `name` VARCHAR(64) NOT NULL,
    `data` BLOB NULL,
    `created_at` INTEGER NULL,
    `updated_at` INTEGER NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `info` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `app_code` VARCHAR(25) NOT NULL,
    `app_name` VARCHAR(50) NOT NULL,
    `app_version` VARCHAR(25) NOT NULL,
    `app_logo` VARCHAR(255) NOT NULL DEFAULT '#',
    `app_creator` VARCHAR(255) NOT NULL DEFAULT 'kodesayap',
    `app_creator_url` VARCHAR(255) NOT NULL DEFAULT '#',
    `app_release_year` VARCHAR(4) NOT NULL DEFAULT '2021',
    `app_release_date` DATE NOT NULL,
    `company_code` VARCHAR(25) NOT NULL,
    `company_name` VARCHAR(255) NOT NULL,
    `company_logo` VARCHAR(255) NOT NULL DEFAULT '#',
    `company_address` VARCHAR(255) NOT NULL DEFAULT '#',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_grade` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `grade` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `unGrade`(`grade`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_jenjang` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `jenjang` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `unJenjang`(`jenjang`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_jurusan` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `jurusan` VARCHAR(25) NOT NULL,
    `description` VARCHAR(255) NOT NULL DEFAULT '-',
    `logo` VARCHAR(255) NOT NULL,
    `sekolah_id` VARCHAR(25) NOT NULL,
    `created_by` VARCHAR(25) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `unJurusan`(`jurusan`),
    INDEX `fkMJSekSekolahID`(`sekolah_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_kelas` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `kelas` VARCHAR(25) NOT NULL,
    `decription` VARCHAR(255) NOT NULL,
    `grade_id` VARCHAR(25) NOT NULL,
    `jurusan_id` VARCHAR(25) NOT NULL,
    `wali_kelas` VARCHAR(25) NULL,
    `created_by` VARCHAR(25) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `unKelas`(`kelas`),
    INDEX `fkMKEGradeID`(`grade_id`),
    INDEX `fkMKEJurusanID`(`jurusan_id`),
    INDEX `fkMKEWaliKelasID`(`wali_kelas`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_pendidik` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nuptk` VARCHAR(25) NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `gender` ENUM('L', 'P') NOT NULL,
    `no_wa` VARCHAR(25) NOT NULL,
    `created_by` VARCHAR(25) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `unNuptk`(`nuptk`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_sekolah` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `npsn` VARCHAR(25) NOT NULL DEFAULT '-',
    `nss` VARCHAR(25) NOT NULL DEFAULT '-',
    `code` VARCHAR(25) NOT NULL,
    `sekolah` VARCHAR(255) NOT NULL,
    `jenjang_id` VARCHAR(25) NOT NULL,
    `status_id` VARCHAR(25) NOT NULL,
    `phone` VARCHAR(25) NOT NULL DEFAULT '-',
    `photo` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL DEFAULT '-',
    `website` VARCHAR(255) NOT NULL DEFAULT '-',
    `latitude` VARCHAR(255) NOT NULL DEFAULT '-',
    `longitude` VARCHAR(255) NOT NULL DEFAULT '-',
    `kota_id` VARCHAR(25) NOT NULL,
    `kecamatan` VARCHAR(100) NOT NULL DEFAULT '-',
    `kelurahan` VARCHAR(100) NOT NULL DEFAULT '-',
    `address` VARCHAR(255) NOT NULL DEFAULT '-',
    `kodepos` VARCHAR(255) NOT NULL DEFAULT '-',
    `token` VARCHAR(255) NOT NULL,
    `created_by` VARCHAR(25) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `unCode`(`code`),
    INDEX `fkSJJenjangID`(`jenjang_id`),
    INDEX `fkSJStatusID`(`status_id`),
    INDEX `fkSJUsserID`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_siswa` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nisn` VARCHAR(25) NOT NULL,
    `fullname` VARCHAR(100) NOT NULL,
    `gender` ENUM('L', 'P') NOT NULL,
    `no_wa` VARCHAR(25) NOT NULL DEFAULT '-',
    `kelas_id` VARCHAR(25) NOT NULL,
    `created_by` VARCHAR(25) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `unNisn`(`nisn`),
    INDEX `fkMSIKelasID`(`kelas_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_status` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `unStatus`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_tahunpelajaran` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tahun_pelajaran` VARCHAR(25) NOT NULL,
    `semester` ENUM('GANJIL', 'GENAP') NOT NULL,
    `periode_awal` DATE NOT NULL,
    `periode_akhir` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `menu` VARCHAR(25) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(255) NOT NULL DEFAULT '#',
    `icon_class` VARCHAR(255) NOT NULL DEFAULT '#',
    `url` VARCHAR(255) NOT NULL DEFAULT '#',
    `is_parent` INTEGER NOT NULL DEFAULT 0,
    `is_active` INTEGER NOT NULL DEFAULT 1,
    `is_untagged` INTEGER NOT NULL DEFAULT 0,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `parent_id` VARCHAR(25) NOT NULL,
    `module_id` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `menu`(`menu`),
    INDEX `fkMenuModuleID`(`module_id`),
    INDEX `fkMenuParentID`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migration` (
    `version` VARCHAR(180) NOT NULL,
    `apply_time` INTEGER NULL,

    PRIMARY KEY (`version`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `module` VARCHAR(25) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(255) NOT NULL DEFAULT '#',
    `icon_class` VARCHAR(255) NOT NULL DEFAULT 'primary',
    `icon_image` VARCHAR(255) NOT NULL DEFAULT '/_kdspanel/img/satudata/module_default.png',
    `theme` VARCHAR(255) NOT NULL DEFAULT 'cust-theme-1.css',
    `url` VARCHAR(255) NOT NULL DEFAULT '#',
    `sort` INTEGER NOT NULL DEFAULT 0,
    `is_active` INTEGER NOT NULL DEFAULT 1,
    `is_visible` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `unModuleId`(`module`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module_sekolah` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `sekolah_id` VARCHAR(25) NOT NULL,
    `module_id` VARCHAR(25) NOT NULL,
    `created_by` VARCHAR(25) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fkSMModuleID`(`module_id`),
    INDEX `fkSMSekolahID`(`sekolah_id`),
    INDEX `fkSMUserID`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(25) NOT NULL,
    `description` VARCHAR(255) NOT NULL DEFAULT '-',

    UNIQUE INDEX `unRole`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_menu` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `role_id` VARCHAR(25) NOT NULL,
    `menu_id` VARCHAR(25) NOT NULL,

    INDEX `fkRoleMenuMenuID`(`menu_id`),
    INDEX `fkRoleMenuRoleID`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_module` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `role_id` VARCHAR(25) NOT NULL,
    `module_id` VARCHAR(25) NOT NULL,

    INDEX `fkRoleModuleModuleID`(`module_id`),
    INDEX `fkRoleModuleRoleID`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `route` (
    `name` VARCHAR(64) NOT NULL,
    `alias` VARCHAR(64) NOT NULL,
    `type` VARCHAR(64) NOT NULL,
    `status` SMALLINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(25) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `auth_key` VARCHAR(255) NOT NULL DEFAULT '-',
    `password_reset_token` VARCHAR(255) NOT NULL DEFAULT '-',
    `status` VARCHAR(5) NOT NULL DEFAULT '10',
    `email` VARCHAR(255) NOT NULL DEFAULT '-',
    `photo` VARCHAR(255) NOT NULL DEFAULT '/_kdspanel/img/satudata/user_default.png',
    `role_id` VARCHAR(25) NOT NULL,
    `sekolah_id` VARCHAR(25) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `unUsername`(`username`),
    INDEX `fkURSekolahID`(`sekolah_id`),
    INDEX `fkUserRoleIdn`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_menu` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(25) NOT NULL,
    `menu_id` VARCHAR(25) NOT NULL,

    INDEX `fkUserMenuMenuID`(`menu_id`),
    INDEX `fkUserMenuUserID`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_module` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(25) NOT NULL,
    `module_id` VARCHAR(25) NOT NULL,

    INDEX `fkUserModuleModID`(`module_id`),
    INDEX `fkUserModuleUserID`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `absensi_sma3bondowoso` ADD CONSTRAINT `FKabsSiswaID` FOREIGN KEY (`siswa_id`) REFERENCES `master_siswa`(`nisn`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth_assignment` ADD CONSTRAINT `auth_assignment_ibfk_1` FOREIGN KEY (`item_name`) REFERENCES `auth_item`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth_item` ADD CONSTRAINT `auth_item_ibfk_1` FOREIGN KEY (`rule_name`) REFERENCES `auth_rule`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth_item_child` ADD CONSTRAINT `auth_item_child_ibfk_2` FOREIGN KEY (`child`) REFERENCES `auth_item`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth_item_child` ADD CONSTRAINT `auth_item_child_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `auth_item`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_jurusan` ADD CONSTRAINT `fkMJSekSekolahID` FOREIGN KEY (`sekolah_id`) REFERENCES `master_sekolah`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_kelas` ADD CONSTRAINT `fkMKEGradeID` FOREIGN KEY (`grade_id`) REFERENCES `master_grade`(`grade`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_kelas` ADD CONSTRAINT `fkMKEJurusanID` FOREIGN KEY (`jurusan_id`) REFERENCES `master_jurusan`(`jurusan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_kelas` ADD CONSTRAINT `fkMKEWaliKelasID` FOREIGN KEY (`wali_kelas`) REFERENCES `master_pendidik`(`nuptk`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_sekolah` ADD CONSTRAINT `fkSJUsserID` FOREIGN KEY (`created_by`) REFERENCES `user`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_sekolah` ADD CONSTRAINT `fkSJJenjangID` FOREIGN KEY (`jenjang_id`) REFERENCES `master_jenjang`(`jenjang`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_sekolah` ADD CONSTRAINT `fkSJStatusID` FOREIGN KEY (`status_id`) REFERENCES `master_status`(`status`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_siswa` ADD CONSTRAINT `fkMSIKelasID` FOREIGN KEY (`kelas_id`) REFERENCES `master_kelas`(`kelas`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `fkMenuModuleID` FOREIGN KEY (`module_id`) REFERENCES `module`(`module`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `fkMenuParentID` FOREIGN KEY (`parent_id`) REFERENCES `menu`(`menu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_sekolah` ADD CONSTRAINT `fkSMUserID` FOREIGN KEY (`created_by`) REFERENCES `user`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_sekolah` ADD CONSTRAINT `fkSMModuleID` FOREIGN KEY (`module_id`) REFERENCES `module`(`module`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_sekolah` ADD CONSTRAINT `fkSMSekolahID` FOREIGN KEY (`sekolah_id`) REFERENCES `master_sekolah`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_menu` ADD CONSTRAINT `fkRoleMenuMenuID` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`menu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_menu` ADD CONSTRAINT `fkRoleMenuRoleID` FOREIGN KEY (`role_id`) REFERENCES `role`(`role`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_module` ADD CONSTRAINT `fkRoleModuleModuleID` FOREIGN KEY (`module_id`) REFERENCES `module`(`module`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_module` ADD CONSTRAINT `fkRoleModuleRoleID` FOREIGN KEY (`role_id`) REFERENCES `role`(`role`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `fkURRoleID` FOREIGN KEY (`role_id`) REFERENCES `role`(`role`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `fkURSekolahID` FOREIGN KEY (`sekolah_id`) REFERENCES `master_sekolah`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_menu` ADD CONSTRAINT `fkUserMenuMenuID` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`menu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_menu` ADD CONSTRAINT `fkUserMenuUserID` FOREIGN KEY (`user_id`) REFERENCES `user`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_module` ADD CONSTRAINT `fkUserModuleModID` FOREIGN KEY (`module_id`) REFERENCES `module`(`module`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_module` ADD CONSTRAINT `fkUserModuleUserID` FOREIGN KEY (`user_id`) REFERENCES `user`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
