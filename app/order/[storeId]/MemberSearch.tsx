import { FaSearch, FaTimes } from "react-icons/fa"
import { Customer } from "@/types"

interface MemberSearchProps {
  searchMember: string
  handleSearchMember: (e: React.ChangeEvent<HTMLInputElement>) => void
  members: Customer[]
  handleMemberSelect: (member: Customer) => void
  searchResultsRef: React.RefObject<HTMLDivElement>
  selectedMember: Customer | null
  setSearchMember: (value: string) => void
  setMembers: (members: Customer[]) => void
  setSelectedMember: (member: Customer | null) => void
}

export default function MemberSearch({
  searchMember,
  handleSearchMember,
  members,
  handleMemberSelect,
  searchResultsRef,
  selectedMember,
  setSearchMember,
  setMembers,
  setSelectedMember,
}: MemberSearchProps) {
  // Clear search and results
  const handleClearSearch = () => {
    setSearchMember("")
    setMembers([])
    setSelectedMember(null)
  }

  // Truncate long text
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div className="relative">
      {/* Search Input with Clear Button */}
      <div className="relative">
        <input
          type="text"
          placeholder="輸入電話或姓名"
          value={searchMember}
          onChange={handleSearchMember}
          className="w-full px-4 py-2 border border-amber-200 dark:border-amber-900/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-zinc-800 text-amber-900 dark:text-amber-100 pr-16"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {searchMember && (
            <button
              onClick={handleClearSearch}
              className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-400 transition-colors"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          )}
          <FaSearch className="text-amber-500 ml-1 mr-1" />
        </div>
      </div>

      {/* Search Results Dropdown */}
      {members.length > 0 && (
        <div
          className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-amber-200 dark:border-amber-900/30 rounded-lg shadow-md max-h-44 overflow-y-auto"
          ref={searchResultsRef}
        >
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => handleMemberSelect(member)}
              className="w-full text-left hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-150 rounded-md"
            >
              <div className="flex justify-between items-center p-2 border-b border-amber-100 dark:border-amber-900/10 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-amber-900 dark:text-amber-200 truncate">
                    {member.name}
                    <span className="text-xs ml-1 text-amber-700/80 dark:text-amber-400/80">
                      ({truncateText(member.phone, 10)})
                    </span>
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    最後到店: {new Date(member.lastVisit).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right ml-2">
                  <div className="font-medium text-amber-700 dark:text-amber-300 whitespace-nowrap">
                    NT$ {member.balance.toFixed(0)}
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    {member.gender === "male" ? "男" : "女"}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Member Info */}
      {selectedMember && (
        <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-900/30 shadow-sm">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                {selectedMember.name}
              </p>
              <p className="text-xs text-amber-700 dark:text-slate-400">
                {selectedMember.phone}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-amber-800 dark:text-amber-200 whitespace-nowrap">
                NT$ {selectedMember.balance.toFixed(0)}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 whitespace-nowrap mt-1">
                {selectedMember.gender === "male" ? "男" : "女"}
              </p>
            </div>
          </div>

          <div className="text-xs text-amber-700 dark:text-slate-400 mt-1.5">
            最後到店: {new Date(selectedMember.lastVisit).toLocaleDateString()}
          </div>

          {selectedMember.latestNote && (
            <div className="mt-2 text-xs bg-amber-100/70 dark:bg-amber-900/30 p-2 rounded-md border-l-2 border-amber-500">
              <span className="font-medium block mb-1">備註:</span>
              <div
                className="text-amber-800 dark:text-amber-300 line-clamp-2 overflow-hidden"
                title={selectedMember.latestNote.content}
              >
                {selectedMember.latestNote.content}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
