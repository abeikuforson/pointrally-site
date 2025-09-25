'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface TeamConnection {
  id: string;
  name: string;
  logo: string;
  points: number;
  status: 'connected' | 'pending' | 'disconnected';
}

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth();
  const [teams, setTeams] = useState<TeamConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Mock data for now - will be replaced with actual API calls
        setTeams([
          {
            id: '1',
            name: 'LA Lakers',
            logo: '🏀',
            points: 5000,
            status: 'connected'
          },
          {
            id: '2',
            name: 'LA Dodgers',
            logo: '⚾',
            points: 3500,
            status: 'connected'
          },
          {
            id: '3',
            name: 'LA Rams',
            logo: '🏈',
            points: 2000,
            status: 'connected'
          },
          {
            id: '4',
            name: 'LA Kings',
            logo: '🏒',
            points: 2000,
            status: 'pending'
          }
        ]);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const connectedTeams = teams.filter(t => t.status === 'connected');
  const pendingTeams = teams.filter(t => t.status === 'pending');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">Point</span>
                <span className="text-2xl font-bold text-gray-800">Rally</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Points Summary */}
              <div className="mb-8">
                <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="p-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}!</h1>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-bold">{(profile?.total_points || 0).toLocaleString()}</span>
                      <span className="text-xl">total points</span>
                    </div>
                    <p className="mt-4 text-blue-100">
                      Across {connectedTeams.length} connected teams
                    </p>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Browse Rewards</h3>
                    <p className="text-gray-600 mb-4">
                      Explore available rewards across all your teams
                    </p>
                    <Button fullWidth>View Rewards</Button>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Connect Teams</h3>
                    <p className="text-gray-600 mb-4">
                      Add more teams to maximize your points
                    </p>
                    <Button fullWidth variant="outline">Add Team</Button>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Points History</h3>
                    <p className="text-gray-600 mb-4">
                      Track your earning and spending history
                    </p>
                    <Button fullWidth variant="outline">View History</Button>
                  </div>
                </Card>
              </div>

              {/* Connected Teams */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Connected Teams</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedTeams.map((team) => (
                    <Card key={team.id}>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-4xl">{team.logo}</span>
                          <span className="text-sm text-green-600 font-medium">
                            Connected
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{team.name}</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          {team.points.toLocaleString()} pts
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pending Connections */}
              {pendingTeams.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Pending Connections</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingTeams.map((team) => (
                      <Card key={team.id} className="border-dashed">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-4xl opacity-50">{team.logo}</span>
                            <span className="text-sm text-yellow-600 font-medium">
                              Pending
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{team.name}</h3>
                          <Button size="sm" fullWidth>
                            Complete Setup
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                <Card>
                  <div className="divide-y divide-gray-200">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Lakers Game Attendance</p>
                        <p className="text-sm text-gray-600">Dec 20, 2024</p>
                      </div>
                      <span className="text-green-600 font-semibold">+500 pts</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Dodgers Merchandise Purchase</p>
                        <p className="text-sm text-gray-600">Dec 18, 2024</p>
                      </div>
                      <span className="text-green-600 font-semibold">+250 pts</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Redeemed: Lakers Signed Basketball</p>
                        <p className="text-sm text-gray-600">Dec 15, 2024</p>
                      </div>
                      <span className="text-red-600 font-semibold">-2,000 pts</span>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}