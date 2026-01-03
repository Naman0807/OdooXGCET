import React, { useState, useEffect } from "react";
import { payrollAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";

const Payroll = () => {
	const { user } = useAuth();
	const [payrollData, setPayrollData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchPayroll();
	}, []);

	const fetchPayroll = async () => {
		try {
			const response = await payrollAPI.getMyPayroll();
			setPayrollData(response.data);
		} catch (error) {
			setError("Failed to fetch payroll data");
		} finally {
			setLoading(false);
		}
	};

	const getMonthName = (month) => {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		return months[month - 1];
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
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
					<h2 className="text-3xl font-bold text-white mb-2">
						Payroll Information
					</h2>
					<p className="text-gray-400">
						View your salary structure and payment history
					</p>
				</div>

				{error && (
					<div className="bg-red-600 text-white p-3 rounded-lg mb-6">
						{error}
					</div>
				)}

				{payrollData && (
					<>
						{/* Current Salary Structure */}
						<div className="card mb-8">
							<h3 className="text-xl font-semibold mb-6 text-primary">
								Current Salary Structure
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div className="flex justify-between items-center">
										<span className="text-gray-400">Basic Salary:</span>
										<span className="text-xl font-semibold text-white">
											{formatCurrency(payrollData.salaryBasic)}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-400">Allowances:</span>
										<span className="text-xl font-semibold text-white">
											{formatCurrency(payrollData.salaryAllowance || 0)}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-400">Deductions:</span>
										<span className="text-xl font-semibold text-red-400">
											{formatCurrency(payrollData.salaryDeduction || 0)}
										</span>
									</div>
									<div className="border-t border-gray-600 pt-4">
										<div className="flex justify-between items-center">
											<span className="text-lg font-semibold text-gray-300">
												Net Salary:
											</span>
											<span className="text-2xl font-bold text-green-400">
												{formatCurrency(
													(payrollData.salaryBasic || 0) +
														(payrollData.salaryAllowance || 0) -
														(payrollData.salaryDeduction || 0)
												)}
											</span>
										</div>
									</div>
								</div>

								<div className="bg-gray-700 rounded-lg p-6">
									<h4 className="text-lg font-semibold mb-4 text-white">
										Summary
									</h4>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-gray-400">Annual Basic:</span>
											<span className="text-white font-medium">
												{formatCurrency((payrollData.salaryBasic || 0) * 12)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-400">Annual Allowances:</span>
											<span className="text-white font-medium">
												{formatCurrency(
													(payrollData.salaryAllowance || 0) * 12
												)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-400">Annual Deductions:</span>
											<span className="text-red-400 font-medium">
												{formatCurrency(
													(payrollData.salaryDeduction || 0) * 12
												)}
											</span>
										</div>
										<div className="border-t border-gray-600 pt-3">
											<div className="flex justify-between">
												<span className="text-gray-300 font-semibold">
													Annual Net:
												</span>
												<span className="text-green-400 font-bold">
													{formatCurrency(
														((payrollData.salaryBasic || 0) +
															(payrollData.salaryAllowance || 0) -
															(payrollData.salaryDeduction || 0)) *
															12
													)}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Salary History */}
						<div className="card">
							<h3 className="text-xl font-semibold mb-4 text-primary">
								Payment History
							</h3>
							<div className="overflow-x-auto">
								<table className="w-full text-white">
									<thead>
										<tr className="border-b border-gray-600">
											<th className="text-left py-3 px-4">Month</th>
											<th className="text-left py-3 px-4">Year</th>
											<th className="text-left py-3 px-4">Basic</th>
											<th className="text-left py-3 px-4">Allowance</th>
											<th className="text-left py-3 px-4">Deduction</th>
											<th className="text-left py-3 px-4">Net Salary</th>
											<th className="text-left py-3 px-4">Status</th>
										</tr>
									</thead>
									<tbody>
										{payrollData.salaries?.map((salary) => (
											<tr key={salary.id} className="border-b border-gray-700">
												<td className="py-3 px-4">
													{getMonthName(salary.month)}
												</td>
												<td className="py-3 px-4">{salary.year}</td>
												<td className="py-3 px-4">
													{formatCurrency(salary.basic)}
												</td>
												<td className="py-3 px-4">
													{formatCurrency(salary.allowance)}
												</td>
												<td className="py-3 px-4 text-red-400">
													{formatCurrency(salary.deduction)}
												</td>
												<td className="py-3 px-4 font-semibold text-green-400">
													{formatCurrency(salary.netSalary)}
												</td>
												<td className="py-3 px-4">
													<span className="px-2 py-1 bg-green-600 rounded text-sm">
														Paid
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
								{(!payrollData.salaries ||
									payrollData.salaries.length === 0) && (
									<div className="text-center py-8 text-gray-400">
										No salary history available
									</div>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Payroll;
