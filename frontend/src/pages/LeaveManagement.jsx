import React, { useState, useEffect } from "react";
import { leaveAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";

const LeaveManagement = () => {
	const { user } = useAuth();
	const [leaves, setLeaves] = useState([]);
	const [showApplyForm, setShowApplyForm] = useState(false);
	const [formData, setFormData] = useState({
		leaveType: "Paid",
		startDate: "",
		endDate: "",
		remarks: "",
	});
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		fetchLeaves();
	}, []);

	const fetchLeaves = async () => {
		try {
			const response = await leaveAPI.getMyLeaves();
			setLeaves(response.data);
		} catch (error) {
			setError("Failed to fetch leave data");
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setError("");
		setSuccess("");

		try {
			await leaveAPI.apply(formData);
			setSuccess("Leave request submitted successfully");
			setShowApplyForm(false);
			setFormData({
				leaveType: "Paid",
				startDate: "",
				endDate: "",
				remarks: "",
			});
			fetchLeaves();
		} catch (error) {
			setError(error.response?.data?.error || "Failed to submit leave request");
		} finally {
			setSubmitting(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "Approved":
				return "bg-green-600";
			case "Rejected":
				return "bg-red-600";
			case "Pending":
				return "bg-yellow-600";
			default:
				return "bg-gray-600";
		}
	};

	if (loading)
		return (
			<div className="min-h-screen bg-dark flex items-center justify-center">
				Loading...
			</div>
		);

	return (
		<div className="min-h-screen bg-dark">
			<Navigation />
			<div className="p-6">
				<div className="mb-8">
					<div className="flex justify-between items-center">
						<div>
							<h2 className="text-3xl font-bold text-white mb-2">
								Leave Management
							</h2>
							<p className="text-gray-400">
								Apply for leave and track your requests
							</p>
						</div>
						<button
							onClick={() => setShowApplyForm(true)}
							className="btn-primary"
						>
							Apply for Leave
						</button>
					</div>
				</div>

				{error && (
					<div className="bg-red-600 text-white p-3 rounded-lg mb-6">
						{error}
					</div>
				)}

				{success && (
					<div className="bg-green-600 text-white p-3 rounded-lg mb-6">
						{success}
					</div>
				)}

				{/* Apply Leave Form Modal */}
				{showApplyForm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<div className="card w-full max-w-md">
							<h3 className="text-xl font-semibold mb-4 text-primary">
								Apply for Leave
							</h3>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Leave Type
									</label>
									<select
										name="leaveType"
										value={formData.leaveType}
										onChange={handleInputChange}
										className="input-field"
										required
									>
										<option value="Paid">Paid Leave</option>
										<option value="Sick">Sick Leave</option>
										<option value="Unpaid">Unpaid Leave</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Start Date
									</label>
									<input
										type="date"
										name="startDate"
										value={formData.startDate}
										onChange={handleInputChange}
										className="input-field"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										End Date
									</label>
									<input
										type="date"
										name="endDate"
										value={formData.endDate}
										onChange={handleInputChange}
										className="input-field"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Remarks
									</label>
									<textarea
										name="remarks"
										value={formData.remarks}
										onChange={handleInputChange}
										className="input-field"
										rows="3"
										placeholder="Optional: Add any additional information"
									/>
								</div>
								<div className="flex justify-end space-x-2 pt-4">
									<button
										type="button"
										onClick={() => setShowApplyForm(false)}
										className="btn-secondary"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={submitting}
										className="btn-primary"
									>
										{submitting ? "Submitting..." : "Submit Request"}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Leave History */}
				<div className="card">
					<h3 className="text-xl font-semibold mb-4 text-primary">
						Leave History
					</h3>
					<div className="overflow-x-auto">
						<table className="w-full text-white">
							<thead>
								<tr className="border-b border-gray-600">
									<th className="text-left py-3 px-4">Leave Type</th>
									<th className="text-left py-3 px-4">Start Date</th>
									<th className="text-left py-3 px-4">End Date</th>
									<th className="text-left py-3 px-4">Duration</th>
									<th className="text-left py-3 px-4">Status</th>
									<th className="text-left py-3 px-4">Remarks</th>
									<th className="text-left py-3 px-4">Admin Comments</th>
								</tr>
							</thead>
							<tbody>
								{leaves.map((leave) => {
									const startDate = new Date(leave.startDate);
									const endDate = new Date(leave.endDate);
									const duration =
										Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) +
										1;

									return (
										<tr key={leave.id} className="border-b border-gray-700">
											<td className="py-3 px-4">
												<span
													className={`px-2 py-1 rounded text-sm ${
														leave.leaveType === "Paid"
															? "bg-blue-600"
															: leave.leaveType === "Sick"
															? "bg-green-600"
															: "bg-gray-600"
													}`}
												>
													{leave.leaveType}
												</span>
											</td>
											<td className="py-3 px-4">
												{startDate.toLocaleDateString()}
											</td>
											<td className="py-3 px-4">
												{endDate.toLocaleDateString()}
											</td>
											<td className="py-3 px-4">
												{duration} day{duration > 1 ? "s" : ""}
											</td>
											<td className="py-3 px-4">
												<span
													className={`px-2 py-1 rounded text-sm ${getStatusColor(
														leave.status
													)}`}
												>
													{leave.status}
												</span>
											</td>
											<td className="py-3 px-4 text-gray-400">
												{leave.remarks || "-"}
											</td>
											<td className="py-3 px-4 text-gray-400">
												{leave.adminComments || "-"}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{leaves.length === 0 && (
							<div className="text-center py-8 text-gray-400">
								No leave requests found
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LeaveManagement;
