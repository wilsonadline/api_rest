<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $price = null;

    #[ORM\Column]
    private ?int $stock = null;

    /**
     * @var Collection<int, UserOrderProduct>
     */
    #[ORM\OneToMany(targetEntity: UserOrderProduct::class, mappedBy: 'product')]
    private Collection $userOrderProducts;

    #[ORM\Column(length: 255)]
    private ?string $genre = null;

    #[ORM\Column(length: 255)]
    private ?string $platform = null;

    public function __construct()
    {
        $this->userOrderProducts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(int $stock): static
    {
        $this->stock = $stock;

        return $this;
    }

    /**
     * @return Collection<int, UserOrderProduct>
     */
    public function getUserOrderProducts(): Collection
    {
        return $this->userOrderProducts;
    }

    public function addUserOrderProduct(UserOrderProduct $userOrderProduct): static
    {
        if (!$this->userOrderProducts->contains($userOrderProduct)) {
            $this->userOrderProducts->add($userOrderProduct);
            $userOrderProduct->setProductId($this);
        }

        return $this;
    }

    public function removeUserOrderProduct(UserOrderProduct $userOrderProduct): static
    {
        if ($this->userOrderProducts->removeElement($userOrderProduct)) {
            // set the owning side to null (unless already changed)
            if ($userOrderProduct->getProductId() === $this) {
                $userOrderProduct->setProductId(null);
            }
        }

        return $this;
    }

    public function getGenre(): ?string
    {
        return $this->genre;
    }

    public function setGenre(string $genre): static
    {
        $this->genre = $genre;

        return $this;
    }

    public function getPlatform(): ?string
    {
        return $this->platform;
    }

    public function setPlatform(string $platform): static
    {
        $this->platform = $platform;

        return $this;
    }
}
