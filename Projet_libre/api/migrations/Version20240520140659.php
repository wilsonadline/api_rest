<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240520140659 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE product (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(100) NOT NULL, description LONGTEXT DEFAULT NULL, price NUMERIC(10, 2) NOT NULL, stock INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_order (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, status_id INT DEFAULT NULL, total_price NUMERIC(10, 2) NOT NULL, INDEX IDX_17EB68C09D86650F (user_id), INDEX IDX_17EB68C0881ECFA7 (status_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_order_product (id INT AUTO_INCREMENT NOT NULL, order_id INT DEFAULT NULL, product_id INT DEFAULT NULL, quantity INT NOT NULL, price NUMERIC(10, 2) NOT NULL, INDEX IDX_CBBE00B6FCDAEAAA (order_id), INDEX IDX_CBBE00B6DE18E50B (product_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_order_status (id INT AUTO_INCREMENT NOT NULL, status VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_order ADD CONSTRAINT FK_17EB68C09D86650F FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_order ADD CONSTRAINT FK_17EB68C0881ECFA7 FOREIGN KEY (status_id) REFERENCES user_order_status (id)');
        $this->addSql('ALTER TABLE user_order_product ADD CONSTRAINT FK_CBBE00B6FCDAEAAA FOREIGN KEY (order_id) REFERENCES user_order (id)');
        $this->addSql('ALTER TABLE user_order_product ADD CONSTRAINT FK_CBBE00B6DE18E50B FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE user ADD email VARCHAR(100) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_order DROP FOREIGN KEY FK_17EB68C09D86650F');
        $this->addSql('ALTER TABLE user_order DROP FOREIGN KEY FK_17EB68C0881ECFA7');
        $this->addSql('ALTER TABLE user_order_product DROP FOREIGN KEY FK_CBBE00B6FCDAEAAA');
        $this->addSql('ALTER TABLE user_order_product DROP FOREIGN KEY FK_CBBE00B6DE18E50B');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE user_order');
        $this->addSql('DROP TABLE user_order_product');
        $this->addSql('DROP TABLE user_order_status');
        $this->addSql('ALTER TABLE user DROP email');
    }
}
