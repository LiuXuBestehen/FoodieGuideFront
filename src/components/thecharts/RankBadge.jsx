import {
    Badge,
} from '@chakra-ui/react';
import {
    Star,
    Trophy,
} from 'lucide-react';
// 排名徽章组件
const RankBadge = ({ rank }) => {
    const getBadgeColor = (rank) => {
        if (rank === 1) return 'yellow';
        if (rank === 2) return 'gray';
        if (rank === 3) return 'orange';
        return 'blue';
    };

    const getBadgeIcon = (rank) => {
        if (rank <= 3) return <Trophy size={16} />;
        return <Star size={16} />;
    };

    return (
        <Badge
            colorScheme={getBadgeColor(rank)}
            variant="solid"
            px={3}
            py={1}
            borderRadius="full"
            display="flex"
            alignItems="center"
            gap={1}
            fontWeight="bold"
            fontSize="sm"
        >
            {getBadgeIcon(rank)}
            {rank}
        </Badge>
    );
};

export default RankBadge;