<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240529130612 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product ADD genre VARCHAR(255) NOT NULL, ADD platform VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE user_order RENAME INDEX idx_17eb68c09d86650f TO IDX_17EB68C0A76ED395');
        $this->addSql('ALTER TABLE user_order RENAME INDEX idx_17eb68c0881ecfa7 TO IDX_17EB68C06BF700BD');
        $this->addSql('ALTER TABLE user_order_product RENAME INDEX idx_cbbe00b6fcdaeaaa TO IDX_CBBE00B68D9F6D38');
        $this->addSql('ALTER TABLE user_order_product RENAME INDEX idx_cbbe00b6de18e50b TO IDX_CBBE00B64584665A');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_order_product RENAME INDEX idx_cbbe00b68d9f6d38 TO IDX_CBBE00B6FCDAEAAA');
        $this->addSql('ALTER TABLE user_order_product RENAME INDEX idx_cbbe00b64584665a TO IDX_CBBE00B6DE18E50B');
        $this->addSql('ALTER TABLE user_order RENAME INDEX idx_17eb68c0a76ed395 TO IDX_17EB68C09D86650F');
        $this->addSql('ALTER TABLE user_order RENAME INDEX idx_17eb68c06bf700bd TO IDX_17EB68C0881ECFA7');
        $this->addSql('ALTER TABLE product DROP genre, DROP platform');
    }
}
