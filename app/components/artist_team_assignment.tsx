'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Save } from 'lucide-react'

export default function ArtistTeamAssignment() {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', team: null },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', team: 'Rock Band' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', team: null },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', team: 'Pop Group' },
        { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', team: null },
    ];

    const teams = [
        'Rock Band',
        'Pop Group',
        'Jazz Ensemble',
        'Classical Orchestra',
        'Electronic Music Producers',
    ];


    const [searchTerm, setSearchTerm] = useState('')
    const [assignments, setAssignments] = useState(users)

    const filteredUsers = assignments.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleTeamChange = (userId: number, team: string) => {
        setAssignments(assignments.map(user =>
            user.id === userId ? { ...user, team: team === '_no_team' ? null : team } : user
        ))
    }

    const handleSave = () => {
        // In a real application, you would send this data to your backend
        alert('Assignments saved successfully!')
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Artist Team Assignment</h1>

            <div className="flex mb-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button onClick={handleSave} className="ml-4">
                    <Save className="mr-2 h-4 w-4" /> Save Assignments
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Team Assignment</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Select
                                    value={user.team || ''}
                                    onValueChange={(value) => handleTeamChange(user.id, value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="_no_team">No Team</SelectItem>
                                        {teams.map((team) => (
                                            <SelectItem key={team} value={team}>
                                                {team}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

