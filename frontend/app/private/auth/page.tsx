"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Account {
  account_id: number;
  name: string;
  email: string;
  status: string;
  create_at: string;
}

export default function PrivateAuthPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshAndRetry = async (pageNum: number): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;

      const response = await fetch("https://comics-2mkb.onrender.com/public/account/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      // API returns 'new_access_token' not 'token'
      if (response.ok && (data.new_access_token || data.token)) {
        const newToken = data.new_access_token || data.token;
        localStorage.setItem("token", newToken);
        if (data.refresh_token) {
          localStorage.setItem("refreshToken", data.refresh_token);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const fetchAccounts = async (pageNum: number) => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://comics-2mkb.onrender.com/protected/account/get-account?page=${pageNum}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          const refreshed = await refreshAndRetry(pageNum);
          if (refreshed) {
            fetchAccounts(pageNum);
            return;
          }
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          router.push("/public/auth/login");
          return;
        }
        throw new Error(data.message || "Failed to fetch accounts");
      }

      setAccounts(data.data || []);
      setTotalData(data.total_data || 0);
      setTotalPage(data.total_page || 0);
      setPage(data.page || pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication first
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/public/auth/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (!isCheckingAuth) {
      fetchAccounts(page);
    }
  }, [page, isCheckingAuth]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://comics-2mkb.onrender.com/protected/account/delete-account/${id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await refreshAndRetry(page);
          if (refreshed) {
            handleDelete(id);
            return;
          }
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          router.push("/public/auth/login");
          return;
        }
        // Try to parse error message, but don't fail if response is not JSON
        let errorMessage = "Failed to delete account";
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch {
          // Response is not JSON, use default message
        }
        throw new Error(errorMessage);
      }

      // Refresh the list after successful delete
      fetchAccounts(page);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete account");
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Auth Management</h1>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg">Loading...</div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr key={account.account_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.account_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            account.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.create_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/private/auth/${account.account_id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          View
                        </Link>
                        <Link
                          href={`/private/auth/${account.account_id}/edit`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(account.account_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{totalData > 0 ? (page - 1) * limit + 1 : 0}</span> to{" "}
                <span className="font-medium">{Math.min(page * limit, totalData)}</span> of{" "}
                <span className="font-medium">{totalData}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchAccounts(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  Page {page} of {totalPage}
                </span>
                <button
                  onClick={() => fetchAccounts(page + 1)}
                  disabled={page >= totalPage}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
