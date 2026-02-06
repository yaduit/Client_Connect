import ContactRequest from './contactRequest.model.js';
import ServiceProvider from '../services/serviceProvider.model.js';

/**
 * Create a new contact request
 * POST /api/contact-requests
 */
export const createRequest = async (req, res) => {
  try {
    const seekerId = req.user.id;
    const { providerId, message, contactDetails } = req.body;

    // Validation
    if (!providerId || !contactDetails?.name || !contactDetails?.email) {
      return res.status(400).json({
        message: 'Provider ID, name, and email are required'
      });
    }

    // Check if provider exists
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Prevent self-contact
    if (provider.userId.toString() === seekerId) {
      return res.status(400).json({
        message: 'You cannot contact yourself'
      });
    }

    // Check for duplicate pending request
    const hasPending = await ContactRequest.hasPendingRequest(seekerId, providerId);
    if (hasPending) {
      return res.status(409).json({
        message: 'You already have a pending request with this provider'
      });
    }

    // Create contact request
    const contactRequest = await ContactRequest.create({
      seekerId,
      providerId,
      message: message?.trim() || '',
      contactDetails: {
        name: contactDetails.name.trim(),
        phone: contactDetails.phone?.trim() || '',
        email: contactDetails.email.trim().toLowerCase()
      }
    });

    // Increment provider's inquiry count
    await provider.incrementInquiries();

    return res.status(201).json({
      message: 'Contact request sent successfully',
      contactRequest: {
        id: contactRequest._id,
        status: contactRequest.status,
        createdAt: contactRequest.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating contact request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all contact requests for the logged-in provider
 * GET /api/contact-requests/provider
 */
export const getRequestsForProvider = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find provider profile
    const provider = await ServiceProvider.findOne({ userId });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    // Get requests with populated seeker info
    const requests = await ContactRequest.find({ providerId: provider._id })
      .populate('seekerId', 'name email phoneNum')
      .sort({ createdAt: -1 });

    // Format response
    const formattedRequests = requests.map(req => ({
      id: req._id,
      status: req.status,
      message: req.message,
      contactDetails: req.contactDetails,
      seeker: {
        id: req.seekerId._id,
        name: req.seekerId.name,
        email: req.seekerId.email
      },
      createdAt: req.createdAt,
      respondedAt: req.respondedAt
    }));

    return res.status(200).json({
      requests: formattedRequests,
      total: formattedRequests.length,
      pending: formattedRequests.filter(r => r.status === 'pending').length
    });

  } catch (error) {
    console.error('Error fetching contact requests:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Accept a contact request
 * PATCH /api/contact-requests/:id/accept
 */
export const acceptRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find provider profile
    const provider = await ServiceProvider.findOne({ userId });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    // Find and verify request ownership
    const contactRequest = await ContactRequest.findById(id)
      .populate('seekerId', 'name email phoneNum');

    if (!contactRequest) {
      return res.status(404).json({ message: 'Contact request not found' });
    }

    if (contactRequest.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (contactRequest.status !== 'pending') {
      return res.status(400).json({
        message: `Request already ${contactRequest.status}`
      });
    }

    // Accept the request
    await contactRequest.accept();

    return res.status(200).json({
      message: 'Contact request accepted',
      contactRequest: {
        id: contactRequest._id,
        status: contactRequest.status,
        contactDetails: contactRequest.contactDetails,
        seeker: {
          id: contactRequest.seekerId._id,
          name: contactRequest.seekerId.name,
          email: contactRequest.seekerId.email
        },
        respondedAt: contactRequest.respondedAt
      }
    });

  } catch (error) {
    console.error('Error accepting contact request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Reject a contact request
 * PATCH /api/contact-requests/:id/reject
 */
export const rejectRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find provider profile
    const provider = await ServiceProvider.findOne({ userId });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    // Find and verify request ownership
    const contactRequest = await ContactRequest.findById(id)
      .populate('seekerId', 'name email');

    if (!contactRequest) {
      return res.status(404).json({ message: 'Contact request not found' });
    }

    if (contactRequest.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (contactRequest.status !== 'pending') {
      return res.status(400).json({
        message: `Request already ${contactRequest.status}`
      });
    }

    // Reject the request
    await contactRequest.reject();

    return res.status(200).json({
      message: 'Contact request rejected',
      contactRequest: {
        id: contactRequest._id,
        status: contactRequest.status,
        respondedAt: contactRequest.respondedAt
      }
    });

  } catch (error) {
    console.error('Error rejecting contact request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};