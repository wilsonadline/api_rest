<?php

namespace App\Entity;

use App\Repository\UserOrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserOrderRepository::class)]
class UserOrder
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'userOrders')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'userOrders')]
    private ?UserOrderStatus $status = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $total_price = null;

    /**
     * @var Collection<int, UserOrderProduct>
     */
    #[ORM\OneToMany(targetEntity: UserOrderProduct::class, mappedBy: 'order')]
    private Collection $userOrderProducts;

    public function __construct()
    {
        $this->userOrderProducts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?User
    {
        return $this->user;
    }

    public function setUserId(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getStatusId(): ?UserOrderStatus
    {
        return $this->status;
    }

    public function setStatusId(?UserOrderStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getTotalPrice(): ?string
    {
        return $this->total_price;
    }

    public function setTotalPrice(string $total_price): static
    {
        $this->total_price = $total_price;

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
            $userOrderProduct->setOrderId($this);
        }

        return $this;
    }

    public function removeUserOrderProduct(UserOrderProduct $userOrderProduct): static
    {
        if ($this->userOrderProducts->removeElement($userOrderProduct)) {
            // set the owning side to null (unless already changed)
            if ($userOrderProduct->getOrderId() === $this) {
                $userOrderProduct->setOrderId(null);
            }
        }

        return $this;
    }
}
