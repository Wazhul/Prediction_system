pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ScholarshipManager is Ownable, ReentrancyGuard {
  struct Campaign {
    address creator;
    uint256 goal;
    uint256 raised;
    bool active;
  }

  struct Application {
    address student;
    bool approved;
    bool disbursed;
  }

  mapping(uint256 => Campaign) public campaigns;
  mapping(uint256 => Application[]) public applications;
  uint256 public campaignCount;

  event CampaignCreated(uint256 id, address creator, uint256 goal);
  event DonationReceived(uint256 id, address donor, uint256 amount);
  event ApplicationSubmitted(uint256 campaignId, address student);
  event FundsDisbursed(uint256 campaignId, address student, uint256 amount);

  function createCampaign(uint256 goal) external {
    campaigns[campaignCount] = Campaign(msg.sender, goal, 0, true);
    emit CampaignCreated(campaignCount, msg.sender, goal);
    campaignCount++;
  }

  function donate(uint256 campaignId) external payable nonReentrant {
    Campaign storage campaign = campaigns[campaignId];
    require(campaign.active, "Campaign not active");
    campaign.raised += msg.value;
    emit DonationReceived(campaignId, msg.sender, msg.value);
  }

  function applyForScholarship(uint256 campaignId) external {
    applications[campaignId].push(Application(msg.sender, false, false));
    emit ApplicationSubmitted(campaignId, msg.sender);
  }

  function disburseFunds(uint256 campaignId, uint256 applicationIndex) external onlyOwner nonReentrant {
    Campaign storage campaign = campaigns[campaignId];
    Application storage app = applications[campaignId][applicationIndex];
    require(campaign.active, "Campaign not active");
    require(app.approved && !app.disbursed, "Invalid application state");
    require(campaign.raised > 0, "No funds available");

    app.disbursed = true;
    uint256 amount = campaign.raised;
    campaign.raised = 0;
    payable(app.student).transfer(amount);
    emit FundsDisbursed(campaignId, app.student, amount);
  }
}