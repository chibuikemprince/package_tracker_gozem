### Team/Project Document for Hackathon Submission

---

#### **Team Introduction**

I am **Chibuikem Prince Chisomaga**, a passionate developer and blockchain enthusiast dedicated to solving real-world problems using innovative technology. As the sole member of the team, I have taken on all roles, from development to project management, to bring this idea to life.

You can connect with me on LinkedIn: [Chibuikem Prince Chisomaga](https://www.linkedin.com/in/chibuikemprince/).

---

#### **Useful Links**

- **Backend Branch**: https://github.com/chibuikemprince/package_tracker_gozem/tree/backend
- **Frontend Branch**: https://github.com/chibuikemprince/package_tracker_gozem/tree/fe
- **Smart Contract Branch**: https://github.com/chibuikemprince/package_tracker_gozem/tree/smartcontract
- **Project Live URL**: https://package-tracker-gozem-web.onrender.com
- **Supra Blockchain Documentation**: https://docs.supra.com/

---

#### **Project Description**

The project, **Package Tracker**, is a blockchain-based application designed to streamline the package delivery process. It allows users to:

1. Enter package details for delivery.
2. Notify drivers to pick up the package.
3. Track the real-time location of the package during delivery.
4. Monitor the delivery status, ensuring transparency and accountability.

The application utilizes a **Move-based smart contract** on the Supra blockchain to record and track location changes and delivery statuses. This ensures immutability, security, and trust in the package delivery process.

---

#### **Design/Flow Diagrams**

Below is the high-level flow of the application:

[SENDER] --> [Enter Package Details] --> [Notify Driver]
[DRIVER] --> [Receive Notification] --> [Pick Up Package] --> [Deliver Package]
[RECEIVER] --> [Receive Notification] --> [Monitor Real-Time Location] --> [Receive Package Upon Delivery]

1. **User Interaction**:

   - Sender enters package details (e.g., package name, pickup location, delivery location).
   - Receiver is notified of the package details.

2. **Driver Notification**:

   - Drivers receive a notification to pick up the package.
   - Driver accepts the task and updates the status.

3. **Real-Time Tracking**:

   - Sender and receiver can monitor the package's real-time location using Map and GPS integration.
   - The realtime location change is updated on the blockchain via the smart contract.

4. **Delivery Completion**:
   - Driver marks the package as delivered.
   - The status is updated on the blockchain, and both sender and receiver are notified.

---

#### **Goals of the Project/Problems Solved**

**Goals**:

- To create a transparent and secure package tracking system.
- To leverage blockchain technology for immutable and tamper-proof delivery records.
- To provide real-time tracking for enhanced user experience.

**Problems Solved**:

1. **Lack of Transparency**: Traditional package tracking systems often lack transparency, leading to disputes. Our blockchain-based solution ensures all delivery updates are immutable and verifiable.
2. **Trust Issues**: By recording delivery statuses on the blockchain, we eliminate trust issues between senders, receivers, and delivery personnel.
3. **Real-Time Tracking**: Users can monitor the package's location in real-time, reducing anxiety and improving satisfaction.
4. The smart contract could serve every other platform working on related project.

---

#### **Challenges Faced and Solutions**

1. **Challenge**: Lack of proper documentation for invoking smart contract functions on the backend using the Supra TypeScript SDK.

   - **Solution**: I explored the Supra blockchain community forums and experimented with the SDK to understand its functionality. By trial and error, I successfully implemented the required backend logic and documented the process for future reference.

2. **Challenge**: Integrating real-time GPS tracking with blockchain updates.

   - **Solution**: I used a lightweight GPS API and optimized the frequency of blockchain updates to balance performance and cost.

3. **Challenge**: Designing a user-friendly interface for non-technical users.
   - **Solution**: I conducted quick user testing and iterated on the UI/UX design to ensure simplicity and ease of use.

---
